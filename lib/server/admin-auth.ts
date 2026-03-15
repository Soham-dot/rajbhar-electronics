import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
const DEFAULT_ADMIN_SESSION_SECRET = "change-this-admin-session-secret";

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

function isProductionEnv(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getAdminUsername(): string {
  return getEnv("ADMIN_USERNAME");
}

function getAdminPassword(): string {
  return getEnv("ADMIN_PASSWORD");
}

function getConfiguredSessionSecret(): string {
  return getEnv("ADMIN_SESSION_SECRET");
}

function hasUsableSessionSecret(): boolean {
  const configuredSecret = getConfiguredSessionSecret();

  if (!configuredSecret) {
    return !isProductionEnv();
  }

  if (isProductionEnv() && configuredSecret === DEFAULT_ADMIN_SESSION_SECRET) {
    return false;
  }

  return true;
}

function getSessionSecret(): string {
  const configuredSecret = getConfiguredSessionSecret();

  if (configuredSecret) {
    return configuredSecret;
  }

  return isProductionEnv() ? "" : DEFAULT_ADMIN_SESSION_SECRET;
}

export function getAdminSessionTtlSeconds(): number {
  const rawTtlHours = Number(getEnv("ADMIN_SESSION_TTL_HOURS"));
  const ttlHours =
    Number.isFinite(rawTtlHours) && rawTtlHours > 0 ? rawTtlHours : 24;
  return Math.floor(ttlHours * 60 * 60);
}

export function isAdminAuthConfigured(): boolean {
  return getAdminAuthConfigError() === null;
}

export function getAdminAuthConfigError(): string | null {
  const username = getAdminUsername();
  const password = getAdminPassword();

  if (!username || !password) {
    return "Admin authentication is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in environment variables.";
  }

  const sessionSecret = getConfiguredSessionSecret();
  if (isProductionEnv()) {
    if (!sessionSecret) {
      return "Admin session secret is not configured. Set ADMIN_SESSION_SECRET in Vercel project environment variables.";
    }

    if (sessionSecret === DEFAULT_ADMIN_SESSION_SECRET) {
      return "ADMIN_SESSION_SECRET cannot use the default placeholder value in production.";
    }

    if (sessionSecret.length < 32) {
      return "ADMIN_SESSION_SECRET must be at least 32 characters in production.";
    }
  }

  return null;
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
  if (!hasUsableSessionSecret()) {
    return "";
  }

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
  if (!hasUsableSessionSecret()) {
    return null;
  }

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
