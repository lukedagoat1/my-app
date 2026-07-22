import type { NextRequest } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "sara2024";
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 5 * 60_000;

// ponytail: per-lambda-instance Map, not shared across cold starts or
// concurrent instances — a determined attacker distributed across many
// invocations isn't fully stopped. Good enough for a single-password small
// store; move to Upstash/KV rate limiting if this ever needs real teeth.
// Only wrong-password attempts count here (unlike rateLimit.ts, which caps
// every request) — Sara's own admin session fires many *correct* calls per
// page load and must never trip this.
const failures = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** Checks the admin password header; locks an IP out after 8 wrong passwords / 5 min. */
export function isAdmin(req: NextRequest): boolean {
  const ip = clientIp(req);
  const rec = failures.get(ip);
  const lockedOut = !!rec && rec.count >= MAX_ATTEMPTS && Date.now() < rec.resetAt;
  if (lockedOut) return false;

  const ok = req.headers.get("x-admin-password") === ADMIN_PASSWORD;
  if (!ok) {
    if (!rec || Date.now() > rec.resetAt) failures.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS });
    else rec.count++;
  }
  return ok;
}
