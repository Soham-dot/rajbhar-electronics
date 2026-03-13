import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionFromToken,
  getAdminSessionTtlSeconds,
} from "@/lib/server/admin-auth";

export async function POST() {
  const cookieStore = await cookies();
  const currentToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const currentSession = getAdminSessionFromToken(currentToken);

  if (!currentSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ttlSeconds = getAdminSessionTtlSeconds();
  const refreshedToken = createAdminSessionToken({
    username: currentSession.username,
    ttlSeconds,
  });
  const refreshedSession = getAdminSessionFromToken(refreshedToken);

  if (!refreshedSession) {
    return NextResponse.json({ error: "Failed to refresh session" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true, session: refreshedSession });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: refreshedToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ttlSeconds,
  });

  return response;
}
