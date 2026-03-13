import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSessionToken,
} from "@/lib/server/admin-auth";
import { type LeadStatus, updateLeadStatus } from "@/lib/server/db";

interface UpdateStatusBody {
  status?: unknown;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const sessionToken = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSessionToken(sessionToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const leadId = Number(params.id);
  if (!Number.isInteger(leadId) || leadId <= 0) {
    return NextResponse.json({ error: "Invalid lead ID." }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as UpdateStatusBody | null;
  const statusRaw = typeof body?.status === "string" ? body.status.trim() : "";
  const nextStatus: LeadStatus | null =
    statusRaw === "closed" || statusRaw === "in_process"
      ? statusRaw
      : null;

  if (!nextStatus) {
    return NextResponse.json(
      { error: "Invalid status. Use in_process or closed." },
      { status: 400 }
    );
  }

  try {
    const lead = await updateLeadStatus(leadId, nextStatus);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }
    return NextResponse.json({ lead });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
