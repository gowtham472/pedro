import "server-only";

import { ApiError } from "./apiError";

// Best-effort, single-instance in-memory rate limiting. Good enough for a
// low-traffic MVP running on one serverless instance; a multi-instance
// production deployment should replace this with a shared store (e.g.
// Upstash Redis) since counts here are not shared across instances.
const buckets = new Map<string, { count: number; resetAt: number }>();

const MAX_BUCKETS = 50_000;

export function checkRateLimit(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    if (buckets.size > MAX_BUCKETS) buckets.clear();
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    throw new ApiError(429, "Too many requests. Please slow down and try again shortly.");
  }
}
