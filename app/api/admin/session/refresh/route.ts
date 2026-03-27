import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionFromToken,
  getAdminSessionTtlSeconds,
} from "@/lib/server/admin-auth";
import {
  attachRateLimitHeaders,
  checkRateLimit,
  enforceSameOrigin,
  withNoStore,
} from "../../../../../lib/server/security";

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request, "Invalid session refresh request origin.");
  if (sameOriginError) {
    return withNoStore(sameOriginError);
  }

  const rateLimit = checkRateLimit(request, {
    scope: "admin-session-refresh",
    limit: 30,
    windowMs: 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return withNoStore(
      attachRateLimitHeaders(
        NextResponse.json(
          { error: "Too many requests. Please try again shortly." },
          { status: 429 }
        ),
        rateLimit
      )
    );
  }

  const cookieStore = await cookies();
  const currentToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const currentSession = getAdminSessionFromToken(currentToken);

  if (!currentSession) {
    return withNoStore(
      attachRateLimitHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        rateLimit
      )
    );
  }

  const ttlSeconds = getAdminSessionTtlSeconds();
  const refreshedToken = createAdminSessionToken({
    username: currentSession.username,
    ttlSeconds,
  });
  const refreshedSession = getAdminSessionFromToken(refreshedToken);

  if (!refreshedSession) {
    return withNoStore(
      attachRateLimitHeaders(
        NextResponse.json({ error: "Failed to refresh session" }, { status: 500 }),
        rateLimit
      )
    );
  }

  const response = attachRateLimitHeaders(
    NextResponse.json({ ok: true, session: refreshedSession }),
    rateLimit
  );
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: refreshedToken,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ttlSeconds,
  });

  return withNoStore(response);
}


