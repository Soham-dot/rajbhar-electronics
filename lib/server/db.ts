import { neon } from "@neondatabase/serverless";
import type { BookingLead, ContactLead } from "@/lib/server/leads";

export interface LeadStorageResult {
  stored: boolean;
  skipped: boolean;
  leadId?: number;
  error?: string;
}

export type LeadStatus = "in_process" | "closed";

interface LeadInsertInput {
  leadType: "contact" | "booking" | "coupon_blocked";
  source: string;
  bookingId: string | null;
  name: string;
  phone: string;
  payload: unknown;
  createdAt: string;
}

let tableInitPromise: Promise<void> | null = null;

type SqlClient = ReturnType<typeof neon>;

export interface AdminLeadRow {
  id: number;
  lead_type: string;
  source: string;
  booking_id: string | null;
  name: string;
  phone: string;
  payload: unknown;
  status: LeadStatus;
  created_at: string;
}

function normalizePhoneKey(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  return digits.length > 10 ? digits.slice(-10) : digits;
}

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
          phone_key TEXT NOT NULL,
          payload JSONB NOT NULL,
          status TEXT NOT NULL DEFAULT 'in_process',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `;

      // Backward-compatible upgrades for older leads tables.
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT;`;
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS booking_id TEXT;`;
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS payload JSONB;`;
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS status TEXT;`;
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone_key TEXT;`;

      await sql`UPDATE leads SET source = 'website' WHERE source IS NULL;`;
      await sql`UPDATE leads SET payload = '{}'::jsonb WHERE payload IS NULL;`;
      await sql`
        UPDATE leads
        SET phone_key = RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 10)
        WHERE phone_key IS NULL OR phone_key = '';
      `;
      await sql`
        UPDATE leads
        SET status = 'in_process'
        WHERE status IS NULL OR status NOT IN ('in_process', 'closed');
      `;

      await sql`ALTER TABLE leads ALTER COLUMN source SET DEFAULT 'website';`;
      await sql`ALTER TABLE leads ALTER COLUMN source SET NOT NULL;`;
      await sql`ALTER TABLE leads ALTER COLUMN payload SET DEFAULT '{}'::jsonb;`;
      await sql`ALTER TABLE leads ALTER COLUMN payload SET NOT NULL;`;
      await sql`ALTER TABLE leads ALTER COLUMN phone_key SET DEFAULT '';`;
      await sql`ALTER TABLE leads ALTER COLUMN phone_key SET NOT NULL;`;
      await sql`ALTER TABLE leads ALTER COLUMN status SET DEFAULT 'in_process';`;
      await sql`ALTER TABLE leads ALTER COLUMN status SET NOT NULL;`;

      await sql`CREATE INDEX IF NOT EXISTS leads_lead_type_idx ON leads (lead_type);`;
      await sql`CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);`;
      await sql`CREATE INDEX IF NOT EXISTS leads_booking_id_idx ON leads (booking_id);`;
      await sql`CREATE INDEX IF NOT EXISTS leads_phone_idx ON leads (phone);`;
      await sql`CREATE INDEX IF NOT EXISTS leads_phone_key_idx ON leads (phone_key);`;
      await sql`CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);`;
    })();
  }

  await tableInitPromise;
}

export async function getLeads(): Promise<AdminLeadRow[]> {
  const sql = getSqlClient();
  if (!sql) {
    throw new Error(
      "Database is not configured. Set POSTGRES_URL or DATABASE_URL in environment variables (.env.local for local development, Vercel Project Settings for production) and redeploy/restart."
    );
  }

  await ensureLeadsTable();

  const rows = await sql`
    SELECT
      id,
      lead_type,
      source,
      booking_id,
      name,
      phone,
      payload,
      status,
      created_at
    FROM leads
    ORDER BY created_at DESC;
  `;

  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.map((row) => mapAdminLeadRow(row));
}

export async function updateLeadStatus(
  id: number,
  status: LeadStatus
): Promise<AdminLeadRow | null> {
  const sql = getSqlClient();
  if (!sql) {
    throw new Error(
      "Database is not configured. Set POSTGRES_URL or DATABASE_URL in environment variables (.env.local for local development, Vercel Project Settings for production) and redeploy/restart."
    );
  }

  await ensureLeadsTable();

  const nextStatus: LeadStatus = status === "closed" ? "closed" : "in_process";
  const rows = await sql`
    UPDATE leads
    SET status = ${nextStatus}
    WHERE id = ${id}
    RETURNING
      id,
      lead_type,
      source,
      booking_id,
      name,
      phone,
      payload,
      status,
      created_at;
  `;

  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  return mapAdminLeadRow(rows[0]);
}

export async function hasBookingCouponUsage(
  phone: string,
  couponCode: string
): Promise<boolean> {
  const normalizedPhoneKey = normalizePhoneKey(phone);
  const normalizedCoupon = couponCode.trim().toUpperCase();
  if (!normalizedPhoneKey || !normalizedCoupon) {
    return false;
  }

  const sql = getSqlClient();
  if (!sql) {
    throw new Error(
      "Database is not configured. Coupon validation requires POSTGRES_URL or DATABASE_URL."
    );
  }

  await ensureLeadsTable();

  const rows = await sql`
    SELECT 1
    FROM leads
    WHERE lead_type = 'booking'
      AND COALESCE(
        NULLIF(phone_key, ''),
        RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 10)
      ) = ${normalizedPhoneKey}
      AND UPPER(
        COALESCE(
          payload->'pricing'->>'appliedCoupon',
          payload->>'appliedCoupon',
          ''
        )
      ) = ${normalizedCoupon}
    LIMIT 1;
  `;

  return Array.isArray(rows) && rows.length > 0;
}

function normalizeLeadStatus(value: unknown): LeadStatus {
  return value === "closed" ? "closed" : "in_process";
}

function mapAdminLeadRow(rawRow: unknown): AdminLeadRow {
  const row = rawRow as {
    id?: unknown;
    lead_type?: unknown;
    source?: unknown;
    booking_id?: unknown;
    name?: unknown;
    phone?: unknown;
    payload?: unknown;
    status?: unknown;
    created_at?: unknown;
  };

  return {
    id: Number(row.id),
    lead_type: String(row.lead_type ?? ""),
    source: String(row.source ?? ""),
    booking_id: row.booking_id == null ? null : String(row.booking_id),
    name: String(row.name ?? ""),
    phone: String(row.phone ?? ""),
    payload: row.payload ?? null,
    status: normalizeLeadStatus(row.status),
    created_at: String(row.created_at ?? ""),
  };
}

async function insertLead(input: LeadInsertInput): Promise<LeadStorageResult> {
  const sql = getSqlClient();
  if (!sql) {
    return { stored: false, skipped: true };
  }

  try {
    await ensureLeadsTable();

    const phoneKey = normalizePhoneKey(input.phone);
    const payloadJson = JSON.stringify(input.payload);
    const rows = await sql`
      INSERT INTO leads (
        lead_type,
        source,
        booking_id,
        name,
        phone,
        phone_key,
        payload,
        created_at
      )
      VALUES (
        ${input.leadType},
        ${input.source},
        ${input.bookingId},
        ${input.name},
        ${input.phone},
        ${phoneKey},
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

export async function logCouponReuseBlockedAttempt(input: {
  source: string;
  createdAt: string;
  userAgent: string;
  name: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  attemptedCoupon: string;
  cart: BookingLead["cart"];
  total: number;
}): Promise<LeadStorageResult> {
  const payload = {
    type: "coupon_blocked",
    source: input.source,
    createdAt: input.createdAt,
    userAgent: input.userAgent,
    blockReason: "Coupon reuse blocked for this phone number",
    attemptedCoupon: input.attemptedCoupon,
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
      discount: 0,
      finalTotal: input.total,
      appliedCoupon: input.attemptedCoupon,
    },
  };

  return insertLead({
    leadType: "coupon_blocked",
    source: input.source,
    bookingId: null,
    name: input.name,
    phone: input.phone,
    payload,
    createdAt: input.createdAt,
  });
}
