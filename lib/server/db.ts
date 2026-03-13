import { neon } from "@neondatabase/serverless";
import type { BookingLead, ContactLead } from "@/lib/server/leads";

export interface LeadStorageResult {
  stored: boolean;
  skipped: boolean;
  leadId?: number;
  error?: string;
}

interface LeadInsertInput {
  leadType: "contact" | "booking";
  source: string;
  bookingId: string | null;
  name: string;
  phone: string;
  payload: unknown;
  createdAt: string;
}

let tableInitPromise: Promise<void> | null = null;

type SqlClient = ReturnType<typeof neon>;

function getDatabaseUrl(): string {
  return (
    process.env.POSTGRES_URL?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    ""
  );
}

function getSqlClient(): SqlClient | null {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    return null;
  }

  return neon(databaseUrl);
}

async function ensureLeadsTable(): Promise<void> {
  const sql = getSqlClient();
  if (!sql) {
    return;
  }

  if (!tableInitPromise) {
    tableInitPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS leads (
          id BIGSERIAL PRIMARY KEY,
          lead_type TEXT NOT NULL,
          source TEXT NOT NULL,
          booking_id TEXT,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          payload JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `;

      await sql`CREATE INDEX IF NOT EXISTS leads_lead_type_idx ON leads (lead_type);`;
      await sql`CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);`;
      await sql`CREATE INDEX IF NOT EXISTS leads_booking_id_idx ON leads (booking_id);`;
    })();
  }

  await tableInitPromise;
}

async function insertLead(input: LeadInsertInput): Promise<LeadStorageResult> {
  const sql = getSqlClient();
  if (!sql) {
    return { stored: false, skipped: true };
  }

  try {
    await ensureLeadsTable();

    const payloadJson = JSON.stringify(input.payload);
    const rows = await sql`
      INSERT INTO leads (
        lead_type,
        source,
        booking_id,
        name,
        phone,
        payload,
        created_at
      )
      VALUES (
        ${input.leadType},
        ${input.source},
        ${input.bookingId},
        ${input.name},
        ${input.phone},
        ${payloadJson}::jsonb,
        ${input.createdAt}::timestamptz
      )
      RETURNING id;
    `;

    const firstRow = Array.isArray(rows) ? rows[0] : undefined;
    const leadId =
      firstRow && typeof firstRow === "object" && "id" in firstRow
        ? Number((firstRow as { id: unknown }).id)
        : undefined;

    return {
      stored: true,
      skipped: false,
      leadId: Number.isFinite(leadId) ? leadId : undefined,
    };
  } catch (error) {
    return {
      stored: false,
      skipped: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
}

export async function storeContactLead(
  input: ContactLead & {
    source: string;
    userAgent: string;
    createdAt: string;
  }
): Promise<LeadStorageResult> {
  const payload = {
    type: "contact",
    source: input.source,
    createdAt: input.createdAt,
    userAgent: input.userAgent,
    name: input.name,
    phone: input.phone,
    tvBrand: input.tvBrand,
    issue: input.issue,
  };

  return insertLead({
    leadType: "contact",
    source: input.source,
    bookingId: null,
    name: input.name,
    phone: input.phone,
    payload,
    createdAt: input.createdAt,
  });
}

export async function storeBookingLead(
  input: BookingLead & {
    source: string;
    bookingId: string;
    userAgent: string;
    createdAt: string;
  }
): Promise<LeadStorageResult> {
  const payload = {
    type: "booking",
    source: input.source,
    bookingId: input.bookingId,
    createdAt: input.createdAt,
    userAgent: input.userAgent,
    customer: {
      name: input.name,
      phone: input.phone,
      address: input.address,
      date: input.date,
      time: input.time,
    },
    cart: input.cart,
    pricing: {
      total: input.total,
      discount: input.discount,
      finalTotal: input.finalTotal,
      appliedCoupon: input.appliedCoupon,
    },
  };

  return insertLead({
    leadType: "booking",
    source: input.source,
    bookingId: input.bookingId,
    name: input.name,
    phone: input.phone,
    payload,
    createdAt: input.createdAt,
  });
}
