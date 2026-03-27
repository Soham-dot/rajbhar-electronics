import { createHash } from "crypto";
import { NextResponse } from "next/server";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitStore = Map<string, RateLimitBucket>;
const IDEMPOTENCY_KEY_PATTERN = /^[a-zA-Z0-9:_-]{8,128}$/;

declare global {
  // eslint-disable-next-line no-var
  var __rajbharRateLimitStore: RateLimitStore | undefined;
}

export interface RateLimitOptions {
  scope: string;
  limit: number;
  windowMs: number;
  keySuffix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAtUnix: number;
  retryAfterSeconds: number;
}

function getRateLimitStore(): RateLimitStore {
  if (!globalThis.__rajbharRateLimitStore) {
    globalThis.__rajbharRateLimitStore = new Map<string, RateLimitBucket>();
  }
  return globalThis.__rajbharRateLimitStore;
}

function readFirstHeaderValue(rawValue: string | null): string {
  return rawValue?.split(",")[0]?.trim() ?? "";
}

function normalizeIp(rawValue: string): string {
  const trimmed = rawValue.trim();
  if (!trimmed) return "";

  let candidate = trimmed;

  if (trimmed.startsWith("[") && trimmed.includes("]")) {
    candidate = trimmed.slice(1, trimmed.indexOf("]"));
  } else {
    const colonCount = (trimmed.match(/:/g) ?? []).length;
    if (trimmed.includes(".") && colonCount === 1) {
      candidate = trimmed.split(":")[0] ?? trimmed;
    }
  }

  return candidate.replace(/[^0-9a-fA-F:.]/g, "").slice(0, 64);
}

function hashRateKey(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function sanitizeKeyPart(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9:_-]/g, "").slice(0, 64);
}

function getRequestHost(request: Request): string {
  return (
    readFirstHeaderValue(request.headers.get("x-forwarded-host")) ||
    readFirstHeaderValue(request.headers.get("host"))
  );
}

function getRequestProtocol(request: Request): string {
  const forwardedProto = readFirstHeaderValue(
    request.headers.get("x-forwarded-proto")
  );
  if (forwardedProto) {
    return forwardedProto;
  }

  try {
    return new URL(request.url).protocol.replace(":", "");
  } catch {
    return "";
  }
}

function cleanupRateLimitStore(
  store: RateLimitStore,
  nowUnixMs: number
): void {
  if (store.size < 2000) return;

  for (const [key, bucket] of store) {
    if (bucket.resetAt <= nowUnixMs) {
      store.delete(key);
    }
  }

  if (store.size > 4000) {
    for (const key of store.keys()) {
      store.delete(key);
      if (store.size <= 3000) {
        break;
      }
    }
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = readFirstHeaderValue(request.headers.get("x-forwarded-for"));
  const realIp = readFirstHeaderValue(request.headers.get("x-real-ip"));
  const cfIp = readFirstHeaderValue(request.headers.get("cf-connecting-ip"));

  const ip = normalizeIp(forwardedFor || realIp || cfIp);
  return ip || "unknown";
}

export function checkRateLimit(
  request: Request,
  options: RateLimitOptions
): RateLimitResult {
  const nowUnixMs = Date.now();
  const windowMs = Math.max(1_000, Math.floor(options.windowMs));
  const limit = Math.max(1, Math.floor(options.limit));
  const scope = sanitizeKeyPart(options.scope) || "default";
  const suffix = sanitizeKeyPart(options.keySuffix ?? "");

  const keyMaterial = [scope, getClientIp(request), suffix]
    .filter(Boolean)
    .join(":");
  const storageKey = hashRateKey(keyMaterial);

  const store = getRateLimitStore();
  cleanupRateLimitStore(store, nowUnixMs);

  const existing = store.get(storageKey);

  if (!existing || existing.resetAt <= nowUnixMs) {
    const resetAt = nowUnixMs + windowMs;
    store.set(storageKey, { count: 1, resetAt });
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetAtUnix: Math.ceil(resetAt / 1000),
      retryAfterSeconds: Math.max(1, Math.ceil(windowMs / 1000)),
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetAtUnix: Math.ceil(existing.resetAt / 1000),
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - nowUnixMs) / 1000)
      ),
    };
  }

  existing.count += 1;
  store.set(storageKey, existing);

  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - existing.count),
    resetAtUnix: Math.ceil(existing.resetAt / 1000),
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((existing.resetAt - nowUnixMs) / 1000)
    ),
  };
}

export function attachRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(result.resetAtUnix));
  if (!result.allowed) {
    response.headers.set("Retry-After", String(result.retryAfterSeconds));
  }
  return response;
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin")?.trim();
  if (!origin) {
    // Non-browser or same-origin form submissions may omit Origin.
    return true;
  }

  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }

  const requestHost = getRequestHost(request);
  if (!requestHost) {
    return false;
  }

  if (originUrl.host !== requestHost) {
    return false;
  }

  const requestProtocol = getRequestProtocol(request);
  if (requestProtocol && originUrl.protocol !== `${requestProtocol}:`) {
    return false;
  }

  return true;
}

export function enforceSameOrigin(
  request: Request,
  errorMessage = "Invalid request origin."
): NextResponse | null {
  if (isSameOriginRequest(request)) {
    return null;
  }

  return NextResponse.json(
    { ok: false, error: errorMessage },
    { status: 403 }
  );
}

export function enforceRequestSize(
  request: Request,
  maxBytes: number,
  errorMessage = "Request payload is too large."
): NextResponse | null {
  const rawLength = request.headers.get("content-length");
  if (!rawLength) {
    return null;
  }

  const contentLength = Number.parseInt(rawLength, 10);
  if (!Number.isFinite(contentLength) || contentLength < 0) {
    return NextResponse.json(
      { ok: false, error: "Invalid content length." },
      { status: 400 }
    );
  }

  if (contentLength > Math.max(1, Math.floor(maxBytes))) {
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 413 });
  }

  return null;
}

export function withNoStore(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

export function parseIdempotencyKey(headerValue: string | null): {
  key: string | null;
  error: string | null;
} {
  const normalized = headerValue?.trim() ?? "";
  if (!normalized) {
    return { key: null, error: null };
  }

  if (!IDEMPOTENCY_KEY_PATTERN.test(normalized)) {
    return {
      key: null,
      error:
        "Invalid Idempotency-Key header. Use 8-128 characters: letters, numbers, colon, underscore, hyphen.",
    };
  }

  return { key: normalized, error: null };
}

