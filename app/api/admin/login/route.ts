import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminAuthConfigError,
  getAdminSessionTtlSeconds,
  validateAdminCredentials,
} from "@/lib/server/admin-auth";

interface LoginBody {
  username?: string;
  password?: string;
}

export async function POST(request: Request) {
  const configError = getAdminAuthConfigError();
  if (configError) {
    return NextResponse.json(
      {
        error: configError,
      },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => null)) as LoginBody | null;
  const username = body?.username?.trim() || "";
  const password = body?.password || "";

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const ttlSeconds = getAdminSessionTtlSeconds();
  const sessionToken = createAdminSessionToken({ username, ttlSeconds });
  if (!sessionToken) {
    return NextResponse.json(
      {
        error:
          "Unable to create admin session token. Check ADMIN_SESSION_SECRET configuration in environment variables.",
      },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ttlSeconds,
  });

  return response;
}
