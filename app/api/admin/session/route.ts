import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionFromToken,
} from "@/lib/server/admin-auth";
import { withNoStore } from "../../../../lib/server/security";

export async function GET() {
  const sessionToken = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const session = getAdminSessionFromToken(sessionToken);

  if (!session) {
    return withNoStore(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );
  }

  return withNoStore(NextResponse.json({ session }));
}


