export function createIdempotencyKey(scope: string): string {
  const normalizedScope =
    scope
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "")
      .slice(0, 24) || "request";

  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${normalizedScope}-${crypto.randomUUID().replace(/-/g, "")}`;
  }

  const randomPart = Math.random().toString(36).slice(2, 12);
  return `${normalizedScope}-${Date.now().toString(36)}-${randomPart}`;
}
