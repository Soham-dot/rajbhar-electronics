"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LeadStatus = "in_process" | "closed";

type Lead = {
  id: number;
  lead_type: "contact" | "booking" | string;
  source: string;
  booking_id: string | null;
  name: string;
  phone: string;
  payload: unknown;
  status: LeadStatus | string;
  created_at: string;
};

type LeadDetails = {
  location: string;
  queryText: string;
  fullAddress: string;
  coupon: string;
};

type SessionInfo = {
  username: string;
  issuedAt: string;
  expiresAt: string;
  issuedAtUnix: number;
  expiresAtUnix: number;
  secondsRemaining: number;
  ttlSeconds: number;
};

type FilterType = "all" | "contact" | "booking";

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

function formatRemainingTime(totalSeconds: number): string {
  if (totalSeconds <= 0) {
    return "Expired";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

function isToday(value: string): boolean {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStatus(value: unknown): LeadStatus {
  return value === "closed" ? "closed" : "in_process";
}

async function readApiError(
  response: Response,
  fallbackMessage: string
): Promise<string> {
  const body = await response
    .json()
    .catch(async () => ({ error: (await response.text().catch(() => "")).trim() }));
  const errorText =
    body && typeof body === "object" && "error" in body
      ? String((body as { error?: unknown }).error ?? "").trim()
      : "";
  return errorText || `${fallbackMessage} (HTTP ${response.status})`;
}

function deriveLeadDetails(lead: Lead): LeadDetails {
  const payload = asRecord(lead.payload);
  const customer = asRecord(payload?.customer);
  const pricing = asRecord(payload?.pricing);

  const fullAddress = asText(customer?.address) || asText(payload?.address);

  const payloadLocation = asText(customer?.location) || asText(payload?.location);
  const locationFromAddress = fullAddress
    ? fullAddress
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)[0] || ""
    : "";
  const location = payloadLocation || locationFromAddress || "-";

  const issueText = asText(payload?.issue);
  const tvBrand = asText(payload?.tvBrand);

  let queryText = issueText;
  if (!queryText && tvBrand) {
    queryText = `TV Brand: ${tvBrand}`;
  }

  if (!queryText && Array.isArray(payload?.cart)) {
    const cartSummary = payload.cart
      .map((entry) => {
        const item = asRecord(entry);
        if (!item) {
          return "";
        }

        const serviceName = asText(item.serviceName);
        const issueName = asText(item.issueName);
        const quantityRaw = Number(item.quantity);
        const quantity = Number.isFinite(quantityRaw) && quantityRaw > 0 ? Math.floor(quantityRaw) : 1;

        const title = [serviceName, issueName].filter(Boolean).join(" - ");
        if (!title) {
          return "";
        }
        return `${title} x${quantity}`;
      })
      .filter(Boolean)
      .join("; ");

    queryText = cartSummary;
  }

  const coupon = asText(pricing?.appliedCoupon) || asText(payload?.appliedCoupon);

  return {
    location,
    queryText: queryText || "-",
    fullAddress: fullAddress || "-",
    coupon: coupon || "No coupon",
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sessionRefreshing, setSessionRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [sessionError, setSessionError] = useState("");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [loggingOut, setLoggingOut] = useState(false);
  const [sessionSecondsRemaining, setSessionSecondsRemaining] = useState(0);
  const [statusUpdatingById, setStatusUpdatingById] = useState<Record<number, boolean>>({});

  const setStatusUpdating = (leadId: number, updating: boolean) => {
    setStatusUpdatingById((previous) => {
      if (updating) {
        return { ...previous, [leadId]: true };
      }
      const next = { ...previous };
      delete next[leadId];
      return next;
    });
  };

  const loadSession = useCallback(
    async (silent = false) => {
      if (!silent) {
        setSessionLoading(true);
      }

      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" });
        if (response.status === 401) {
          router.replace("/admin/login");
          return;
        }
        if (!response.ok) {
          throw new Error(
            await readApiError(response, "Failed to load session details.")
          );
        }

        const data = (await response.json()) as { session?: SessionInfo };
        setSession(data.session ?? null);
        setSessionError("");
      } catch (sessionLoadError) {
        if (silent) {
          return;
        }
        setSessionError(
          sessionLoadError instanceof Error
            ? sessionLoadError.message
            : "Failed to load session details."
        );
      } finally {
        if (!silent) {
          setSessionLoading(false);
        }
      }
    },
    [router]
  );

  const loadLeads = useCallback(
    async (showRefreshState = false) => {
      setError("");
      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await fetch("/api/leads", { cache: "no-store" });
        if (!response.ok) {
          if (response.status === 401) {
            router.replace("/admin/login");
            return;
          }
          throw new Error(await readApiError(response, "Failed to load leads"));
        }
        const data: { leads?: Lead[] } = await response.json();
        setLeads(Array.isArray(data.leads) ? data.leads : []);
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load leads."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router]
  );

  useEffect(() => {
    loadLeads();
    loadSession();
  }, [loadLeads, loadSession]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadSession(true);
    }, 30_000);
    return () => clearInterval(interval);
  }, [loadSession]);

  useEffect(() => {
    if (!session) {
      setSessionSecondsRemaining(0);
      return;
    }

    const updateRemainingTime = () => {
      const expiresAtMs = new Date(session.expiresAt).getTime();
      if (Number.isNaN(expiresAtMs)) {
        setSessionSecondsRemaining(0);
        return;
      }
      setSessionSecondsRemaining(
        Math.max(0, Math.floor((expiresAtMs - Date.now()) / 1000))
      );
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1_000);
    return () => clearInterval(interval);
  }, [session]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  };

  const handleExtendSession = async () => {
    setSessionRefreshing(true);
    setSessionError("");
    try {
      const response = await fetch("/api/admin/session/refresh", {
        method: "POST",
      });
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) {
        throw new Error(await readApiError(response, "Failed to refresh session."));
      }

      const data = (await response.json()) as { session?: SessionInfo };
      if (data.session) {
        setSession(data.session);
      }
    } catch (refreshError) {
      setSessionError(
        refreshError instanceof Error
          ? refreshError.message
          : "Failed to refresh session."
      );
    } finally {
      setSessionRefreshing(false);
    }
  };

  const handleLeadStatusUpdate = async (leadId: number, status: LeadStatus) => {
    setError("");
    setStatusUpdating(leadId, true);

    try {
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(await readApiError(response, "Failed to update status."));
      }

      const data = (await response.json()) as { lead?: Lead };
      const nextStatus = normalizeStatus(data.lead?.status ?? status);

      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                status: nextStatus,
              }
            : lead
        )
      );
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : "Failed to update status."
      );
    } finally {
      setStatusUpdating(leadId, false);
    }
  };

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return leads.filter((lead) => {
      const details = deriveLeadDetails(lead);
      const normalizedStatus = normalizeStatus(lead.status);

      const matchesType =
        typeFilter === "all" ? true : lead.lead_type === typeFilter;

      const matchesStatus =
        statusFilter === "all" ? true : normalizedStatus === statusFilter;

      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : [
              lead.name,
              lead.phone,
              lead.source,
              lead.booking_id ?? "",
              String(lead.id),
              details.location,
              details.queryText,
              details.fullAddress,
              details.coupon,
            ]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery);

      return matchesType && matchesStatus && matchesQuery;
    });
  }, [leads, query, typeFilter, statusFilter]);

  const totalLeads = leads.length;
  const bookingLeads = leads.filter((lead) => lead.lead_type === "booking").length;
  const contactLeads = leads.filter((lead) => lead.lead_type === "contact").length;
  const todayLeads = leads.filter((lead) => isToday(lead.created_at)).length;
  const inProcessLeads = leads.filter(
    (lead) => normalizeStatus(lead.status) === "in_process"
  ).length;
  const closedLeads = leads.filter(
    (lead) => normalizeStatus(lead.status) === "closed"
  ).length;

  const isSessionExpiringSoon =
    sessionSecondsRemaining > 0 && sessionSecondsRemaining <= 300;

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 text-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/35">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Monitor and search all incoming leads.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loadLeads(true)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                disabled={refreshing}
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-900/60"
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>

        <section className="rounded-xl border border-black/10 bg-white/85 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Session Manager</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Check session status and extend before it expires.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExtendSession}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
              disabled={sessionRefreshing || sessionLoading}
            >
              {sessionRefreshing ? "Extending..." : "Extend Session"}
            </button>
          </div>

          {sessionLoading ? (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Loading session details...
            </p>
          ) : session ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Username" value={session.username} />
              <StatCard
                label="Session Started"
                value={formatDateTime(session.issuedAt)}
              />
              <StatCard label="Expires At" value={formatDateTime(session.expiresAt)} />
              <StatCard
                label="Time Left"
                value={formatRemainingTime(sessionSecondsRemaining)}
                isAlert={isSessionExpiringSoon}
              />
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              No active session found.
            </p>
          )}

          {sessionError ? (
            <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
              {sessionError}
            </p>
          ) : null}
          {isSessionExpiringSoon ? (
            <p className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-300">
              Session is expiring soon. Click Extend Session to stay signed in.
            </p>
          ) : null}
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total Leads" value={String(totalLeads)} />
          <StatCard label="Booking Leads" value={String(bookingLeads)} />
          <StatCard label="Contact Leads" value={String(contactLeads)} />
          <StatCard label="In Process" value={String(inProcessLeads)} />
          <StatCard label="Closed" value={String(closedLeads)} />
          <StatCard label="Today" value={String(todayLeads)} />
        </section>

        <section className="rounded-xl border border-black/10 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/35">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, number, location, address, query, coupon or lead ID"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900"
            />
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as FilterType)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="all">All Types</option>
              <option value="booking">Booking</option>
              <option value="contact">Contact</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | LeadStatus)
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="all">All Status</option>
              <option value="in_process">In Process</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-black/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-black/45">
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-600 dark:text-gray-300">
              Loading leads...
            </div>
          ) : error && filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-600 dark:text-gray-300">
              No leads found for the current filters.
            </div>
          ) : (
            <div>
              {error ? (
                <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-300">
                  {error}
                </div>
              ) : null}
              <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/80">
                  <tr className="text-left text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Number</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Repair Query</th>
                    <th className="px-4 py-3">Complete Address</th>
                    <th className="px-4 py-3">Coupon</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => {
                    const details = deriveLeadDetails(lead);
                    const normalizedStatus = normalizeStatus(lead.status);
                    const isUpdating = Boolean(statusUpdatingById[lead.id]);

                    return (
                      <tr
                        key={lead.id}
                        className="border-t border-gray-200/80 align-top hover:bg-gray-50/80 dark:border-gray-800 dark:hover:bg-white/5"
                      >
                        <td className="px-4 py-3 font-semibold">{lead.id}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              lead.lead_type === "booking"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                            }`}
                          >
                            {lead.lead_type}
                          </span>
                        </td>
                        <td className="px-4 py-3">{lead.name || "-"}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{lead.phone || "-"}</td>
                        <td className="px-4 py-3">{details.location}</td>
                        <td className="px-4 py-3 min-w-[260px]">{details.queryText}</td>
                        <td className="px-4 py-3 min-w-[240px]">{details.fullAddress}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{details.coupon}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <select
                              value={normalizedStatus}
                              onChange={(event) =>
                                handleLeadStatusUpdate(
                                  lead.id,
                                  event.target.value as LeadStatus
                                )
                              }
                              disabled={isUpdating}
                              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-semibold outline-none ring-offset-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 disabled:opacity-70 dark:border-gray-700 dark:bg-gray-900"
                            >
                              <option value="in_process">In Process</option>
                              <option value="closed">Closed</option>
                            </select>
                            {isUpdating ? (
                              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                Updating...
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {formatDateTime(lead.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  isAlert = false,
}: {
  label: string;
  value: string;
  isAlert?: boolean;
}) {
  return (
    <article className="rounded-xl border border-black/10 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-black/35">
      <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
        {label}
      </p>
      <p
        className={`mt-1 text-lg font-semibold sm:text-xl ${
          isAlert ? "text-amber-700 dark:text-amber-300" : ""
        }`}
      >
        {value}
      </p>
    </article>
  );
}
