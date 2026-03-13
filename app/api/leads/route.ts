import { NextResponse } from "next/server";
import { getLeads } from "../../../lib/server/db";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from "@/lib/server/admin-auth";

export async function GET() {
  const sessionToken = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSessionToken(sessionToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await getLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch leads";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
