import type { NextRequest } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "sara2024";
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 5 * 60_000;

// ponytail: per-lambda-instance Map, not shared across cold starts or
// concurrent instances — a determined attacker distributed across many
// invocations isn't fully stopped. Good enough for a single-password small
// store; move to Upstash/KV rate limiting if this ever needs real teeth.
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** True if this IP is locked out from further password attempts. */
export function isLockedOut(req: NextRequest): boolean {
  const rec = attempts.get(clientIp(req));
  return !!rec && rec.count >= MAX_ATTEMPTS && Date.now() < rec.resetAt;
}

function recordFailure(req: NextRequest) {
  const ip = clientIp(req);
  const rec = attempts.get(ip);
  if (!rec || Date.now() > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS });
  } else {
    rec.count++;
  }
}

/** Checks the admin password header, rate-limited per IP. */
export function isAdmin(req: NextRequest): boolean {
  if (isLockedOut(req)) return false;
  const ok = req.headers.get("x-admin-password") === ADMIN_PASSWORD;
  if (!ok) recordFailure(req);
  return ok;
}
