import { NextResponse } from "next/server";
import { getLeads } from "@/lib/server/db";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from "@/lib/server/admin-auth";
import { attachRateLimitHeaders, checkRateLimit, withNoStore } from "../../../lib/server/security";

export async function GET(request: Request) {
  const rateLimit = checkRateLimit(request, {
    scope: "admin-leads-list",
    limit: 120,
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

  const sessionToken = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSessionToken(sessionToken)) {
    return withNoStore(
      attachRateLimitHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        rateLimit
      )
    );
  }

  try {
    const leads = await getLeads();
    return withNoStore(
      attachRateLimitHeaders(NextResponse.json({ leads }), rateLimit)
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch leads";
    return withNoStore(
      attachRateLimitHeaders(
        NextResponse.json({ error: message }, { status: 500 }),
        rateLimit
      )
    );
  }
}


