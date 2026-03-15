/**
 * Simple in-memory rate limiter for API routes.
 * Note: In serverless (Vercel), this works per instance. For production at scale, consider Redis.
 */

const store = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? "unknown";
}

export function checkRateLimit(ip: string): { limited: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry) {
    return { limited: false, remaining: RATE_LIMIT - 1, resetAt: now + WINDOW_MS };
  }

  if (now > entry.resetAt) {
    store.delete(ip);
    return { limited: false, remaining: RATE_LIMIT - 1, resetAt: now + WINDOW_MS };
  }

  const remaining = Math.max(0, RATE_LIMIT - entry.count - 1);
  return {
    limited: entry.count >= RATE_LIMIT,
    remaining,
    resetAt: entry.resetAt,
  };
}

export function incrementRateLimit(ip: string): void {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else if (now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count++;
  }
}
