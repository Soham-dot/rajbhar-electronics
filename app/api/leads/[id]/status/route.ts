import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSessionToken,
} from "@/lib/server/admin-auth";
import { updateLeadStatus } from "@/lib/server/db";
import {
  attachRateLimitHeaders,
  checkRateLimit,
  enforceRequestSize,
  enforceSameOrigin,
  withNoStore,
} from "../../../../../lib/server/security";
import { leadStatusBodySchema } from "../../../../../lib/server/schemas";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const sameOriginError = enforceSameOrigin(
    request,
    "Invalid lead status update request origin."
  );
  if (sameOriginError) {
    return withNoStore(sameOriginError);
  }

  const sizeError = enforceRequestSize(
    request,
    4 * 1024,
    "Status update payload is too large."
  );
  if (sizeError) {
    return withNoStore(sizeError);
  }

  const rateLimit = checkRateLimit(request, {
    scope: "admin-lead-status-update",
    limit: 60,
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

  const params = await context.params;
  const leadId = Number(params.id);
  if (!Number.isInteger(leadId) || leadId <= 0) {
    return withNoStore(
      attachRateLimitHeaders(
        NextResponse.json({ error: "Invalid lead ID." }, { status: 400 }),
        rateLimit
      )
    );
  }

  let parsedBody: unknown;
  try {
    const rawBody = await request.text();
    parsedBody = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    return withNoStore(
      attachRateLimitHeaders(
        NextResponse.json(
          { error: "Invalid status. Use in_process or closed." },
          { status: 400 }
        ),
        rateLimit
      )
    );
  }

  const bodyResult = leadStatusBodySchema.safeParse(parsedBody);
  if (!bodyResult.success) {
    return withNoStore(
      attachRateLimitHeaders(
        NextResponse.json(
          { error: "Invalid status. Use in_process or closed." },
          { status: 400 }
        ),
        rateLimit
      )
    );
  }

  const nextStatus = bodyResult.data.status;

  try {
    const lead = await updateLeadStatus(leadId, nextStatus);
    if (!lead) {
      return withNoStore(
        attachRateLimitHeaders(
          NextResponse.json({ error: "Lead not found." }, { status: 404 }),
          rateLimit
        )
      );
    }
    return withNoStore(
      attachRateLimitHeaders(NextResponse.json({ lead }), rateLimit)
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update status.";
    return withNoStore(
      attachRateLimitHeaders(
        NextResponse.json({ error: message }, { status: 500 }),
        rateLimit
      )
    );
  }
}

