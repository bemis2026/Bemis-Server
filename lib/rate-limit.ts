// In-memory IP-based rate limiter for serverless routes.
// Good enough for low-traffic admin endpoints; each Vercel instance holds its own
// counter map. For a single login UI (one owner), attackers hitting the same IP
// will land on the same warm instance with high probability.

type Bucket = { count: number; firstAt: number; blockedUntil: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

export function checkRateLimit(
  key: string,
  opts: { maxAttempts: number; windowMs: number; blockMs: number }
): RateLimitResult {
  const now = Date.now();
  const b = buckets.get(key);

  if (b && b.blockedUntil > now) {
    return { ok: false, retryAfterSec: Math.ceil((b.blockedUntil - now) / 1000) };
  }

  if (!b || now - b.firstAt > opts.windowMs) {
    buckets.set(key, { count: 0, firstAt: now, blockedUntil: 0 });
  }

  return { ok: true };
}

export function recordFailure(
  key: string,
  opts: { maxAttempts: number; windowMs: number; blockMs: number }
): RateLimitResult {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now - b.firstAt > opts.windowMs) {
    b = { count: 0, firstAt: now, blockedUntil: 0 };
    buckets.set(key, b);
  }
  b.count += 1;
  if (b.count >= opts.maxAttempts) {
    b.blockedUntil = now + opts.blockMs;
    return { ok: false, retryAfterSec: Math.ceil(opts.blockMs / 1000) };
  }
  return { ok: true };
}

export function clearRateLimit(key: string) {
  buckets.delete(key);
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
