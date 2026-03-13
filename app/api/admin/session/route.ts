import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionFromToken,
} from "@/lib/server/admin-auth";

export async function GET() {
  const sessionToken = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const session = getAdminSessionFromToken(sessionToken);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ session });
}
