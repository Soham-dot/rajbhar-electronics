import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminAuthConfigError,
  getAdminSessionTtlSeconds,
  validateAdminCredentials,
} from "@/lib/server/admin-auth";
import {
  attachRateLimitHeaders,
  checkRateLimit,
  enforceRequestSize,
  enforceSameOrigin,
  withNoStore,
} from "../../../../lib/server/security";
import { adminLoginBodySchema } from "../../../../lib/server/schemas";

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request, "Invalid login request origin.");
  if (sameOriginError) {
    return withNoStore(sameOriginError);
  }

  const sizeError = enforceRequestSize(
    request,
    8 * 1024,
    "Login payload is too large."
  );
  if (sizeError) {
    return withNoStore(sizeError);
  }

  const configError = getAdminAuthConfigError();
  if (configError) {
    console.error("[admin:login] Authentication config issue:", configError);
    return withNoStore(
      NextResponse.json(
        {
          error: "Admin login is temporarily unavailable.",
        },
        { status: 503 }
      )
    );
  }

  let parsedBody: unknown;
  try {
    const rawBody = await request.text();
    parsedBody = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    return withNoStore(
      NextResponse.json({ error: "Invalid username or password format." }, { status: 400 })
    );
  }

  const bodyResult = adminLoginBodySchema.safeParse(parsedBody);
  if (!bodyResult.success) {
    return withNoStore(
      NextResponse.json({ error: "Invalid username or password format." }, { status: 400 })
    );
  }

  const username = bodyResult.data.username;
  const password = bodyResult.data.password;

  const rateLimit = checkRateLimit(request, {
    scope: "admin-login",
    limit: 8,
    windowMs: 10 * 60 * 1000,
    keySuffix: username || "anonymous",
  });
  if (!rateLimit.allowed) {
    return withNoStore(
      attachRateLimitHeaders(
        NextResponse.json(
          { error: "Too many login attempts. Please wait and try again." },
          { status: 429 }
        ),
        rateLimit
      )
    );
  }

  if (!validateAdminCredentials(username, password)) {
    return withNoStore(
      attachRateLimitHeaders(
        NextResponse.json({ error: "Invalid username or password." }, { status: 401 }),
        rateLimit
      )
    );
  }

  const ttlSeconds = getAdminSessionTtlSeconds();
  const sessionToken = createAdminSessionToken({ username, ttlSeconds });
  if (!sessionToken) {
    return withNoStore(
      NextResponse.json(
        {
          error: "Unable to sign in right now. Please try again later.",
        },
        { status: 500 }
      )
    );
  }

  const response = attachRateLimitHeaders(
    NextResponse.json({ ok: true }),
    rateLimit
  );
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: sessionToken,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ttlSeconds,
  });

  return withNoStore(response);
}

