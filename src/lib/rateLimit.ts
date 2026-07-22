import type { NextRequest } from "next/server";

// ponytail: per-lambda-instance Map, resets on cold start, not shared across
// concurrent instances. Fine for deterring casual abuse on a small store;
// swap for Upstash/KV if traffic ever makes that ceiling matter.
const buckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** True if this key (ip + scope) has exceeded `limit` hits in the last `windowMs`. */
export function isRateLimited(req: NextRequest, scope: string, limit: number, windowMs: number): boolean {
  const key = `${scope}:${clientIp(req)}`;
  const rec = buckets.get(key);
  if (!rec || Date.now() > rec.resetAt) {
    buckets.set(key, { count: 1, resetAt: Date.now() + windowMs });
    return false;
  }
  rec.count++;
  return rec.count > limit;
}
