import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";

interface SessionTokenPayload {
  u: string;
  iat: number;
  exp: number;
}

export interface AdminSessionData {
  username: string;
  issuedAt: string;
  expiresAt: string;
  issuedAtUnix: number;
  expiresAtUnix: number;
  secondsRemaining: number;
  ttlSeconds: number;
}

function getEnv(name: string): string {
  return process.env[name]?.trim() || "";
}

export function getAdminUsername(): string {
  return getEnv("ADMIN_USERNAME");
}

function getAdminPassword(): string {
  return getEnv("ADMIN_PASSWORD");
}

function getSessionSecret(): string {
  return getEnv("ADMIN_SESSION_SECRET") || "change-this-admin-session-secret";
}

export function getAdminSessionTtlSeconds(): number {
  const rawTtlHours = Number(getEnv("ADMIN_SESSION_TTL_HOURS"));
  const ttlHours =
    Number.isFinite(rawTtlHours) && rawTtlHours > 0 ? rawTtlHours : 24;
  return Math.floor(ttlHours * 60 * 60);
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(getAdminUsername() && getAdminPassword());
}

export function validateAdminCredentials(
  username: string,
  password: string
): boolean {
  const expectedUsername = getAdminUsername();
  const expectedPassword = getAdminPassword();

  if (!expectedUsername || !expectedPassword) {
    return false;
  }

  return username === expectedUsername && password === expectedPassword;
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddingNeeded = normalized.length % 4;
  const withPadding =
    paddingNeeded === 0 ? normalized : `${normalized}${"=".repeat(4 - paddingNeeded)}`;
  return Buffer.from(withPadding, "base64").toString("utf8");
}

function signTokenPayload(encodedPayload: string): string {
  return createHmac("sha256", getSessionSecret())
    .update(encodedPayload)
    .digest("hex");
}

function safeTokenEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function createAdminSessionToken(options?: {
  username?: string;
  ttlSeconds?: number;
}): string {
  const username = options?.username?.trim() || getAdminUsername();
  if (!username) {
    return "";
  }

  const ttlSeconds =
    options?.ttlSeconds && options.ttlSeconds > 0
      ? Math.floor(options.ttlSeconds)
      : getAdminSessionTtlSeconds();

  const issuedAtUnix = Math.floor(Date.now() / 1000);
  const expiresAtUnix = issuedAtUnix + ttlSeconds;
  const payload: SessionTokenPayload = {
    u: username,
    iat: issuedAtUnix,
    exp: expiresAtUnix,
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signTokenPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function parsePayload(encodedPayload: string): SessionTokenPayload | null {
  try {
    const raw = decodeBase64Url(encodedPayload);
    const payload = JSON.parse(raw) as Partial<SessionTokenPayload>;
    if (
      typeof payload.u !== "string" ||
      !payload.u.trim() ||
      !Number.isFinite(payload.iat) ||
      !Number.isFinite(payload.exp)
    ) {
      return null;
    }

    const issuedAtUnix = Math.floor(Number(payload.iat));
    const expiresAtUnix = Math.floor(Number(payload.exp));
    if (expiresAtUnix <= issuedAtUnix) {
      return null;
    }

    return {
      u: payload.u.trim(),
      iat: issuedAtUnix,
      exp: expiresAtUnix,
    };
  } catch {
    return null;
  }
}

export function getAdminSessionFromToken(
  token: string | undefined
): AdminSessionData | null {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signTokenPayload(encodedPayload);
  if (!safeTokenEqual(signature, expectedSignature)) {
    return null;
  }

  const payload = parsePayload(encodedPayload);
  if (!payload) {
    return null;
  }

  const currentAdminUsername = getAdminUsername();
  if (!currentAdminUsername || payload.u !== currentAdminUsername) {
    return null;
  }

  const nowUnix = Math.floor(Date.now() / 1000);
  const secondsRemaining = payload.exp - nowUnix;
  if (secondsRemaining <= 0) {
    return null;
  }

  return {
    username: payload.u,
    issuedAt: new Date(payload.iat * 1000).toISOString(),
    expiresAt: new Date(payload.exp * 1000).toISOString(),
    issuedAtUnix: payload.iat,
    expiresAtUnix: payload.exp,
    secondsRemaining,
    ttlSeconds: payload.exp - payload.iat,
  };
}

export function isValidAdminSessionToken(token: string | undefined): boolean {
  return Boolean(getAdminSessionFromToken(token));
}
