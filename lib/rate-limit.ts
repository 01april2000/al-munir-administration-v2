import { NextRequest, NextResponse } from "next/server";

/**
 * In-memory sliding window rate limiter for API routes.
 *
 * Usage:
 *   const rateLimitResult = await rateLimit(request, { maxRequests: 5, windowMs: 60_000 });
 *   if (rateLimitResult) return rateLimitResult; // 429 response
 *
 * For authenticated routes, pass the userId to rate-limit per user.
 * For unauthenticated routes (e.g., webhooks), it falls back to IP-based limiting.
 */

interface RateLimitOptions {
  /** Maximum number of requests allowed within the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Optional key suffix to differentiate multiple limits on the same user/IP */
  keyPrefix?: string;
}

interface RequestRecord {
  timestamps: number[];
}

// In-memory store: key -> RequestRecord
const store = new Map<string, RequestRecord>();

// Cleanup interval: remove expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

/**
 * Extract client IP from request headers.
 * Checks common proxy headers before falling back to connection info.
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "unknown";
}

/**
 * Remove expired entries from the store to prevent memory leaks.
 */
function cleanupStore(now: number): void {
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, record] of store.entries()) {
    // Remove timestamps older than the longest reasonable window (10 minutes)
    const cutoff = now - 10 * 60 * 1000;
    record.timestamps = record.timestamps.filter((t) => t > cutoff);
    if (record.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

/**
 * Check if a request should be rate-limited.
 *
 * @param request - The NextRequest object
 * @param userId - Optional user ID for per-user limiting (recommended for authenticated routes)
 * @param options - Rate limit configuration
 * @returns NextResponse with 429 if rate limited, null if allowed
 */
export function rateLimit(
  request: NextRequest,
  options: RateLimitOptions,
  userId?: string
): NextResponse | null {
  const now = Date.now();
  cleanupStore(now);

  // Build the rate limit key
  const identifier = userId || getClientIp(request);
  const key = `${options.keyPrefix || "rl"}:${identifier}`;

  // Get or create record
  let record = store.get(key);
  if (!record) {
    record = { timestamps: [] };
    store.set(key, record);
  }

  // Remove timestamps outside the current window
  const windowStart = now - options.windowMs;
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  // Check if rate limit exceeded
  if (record.timestamps.length >= options.maxRequests) {
    const oldestInWindow = record.timestamps[0];
    const retryAfterMs = oldestInWindow + options.windowMs - now;
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);

    console.warn(
      `Rate limit exceeded for ${key}: ${record.timestamps.length}/${options.maxRequests} requests in ${options.windowMs / 1000}s window`
    );

    return NextResponse.json(
      {
        error: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
        retryAfter: retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
          "X-RateLimit-Limit": String(options.maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(
            oldestInWindow + options.windowMs
          ).toISOString(),
        },
      }
    );
  }

  // Record this request
  record.timestamps.push(now);

  // Request allowed
  return null;
}

/**
 * Pre-configured rate limiters for different endpoint types.
 */
export const RATE_LIMITS = {
  /** Payment creation endpoints (create, topup, laundry) - 5 req/min per user */
  PAYMENT_CREATE: { maxRequests: 5, windowMs: 60 * 1000, keyPrefix: "pay-create" },
  /** Payment confirmation endpoints - 10 req/min per user */
  PAYMENT_CONFIRM: { maxRequests: 10, windowMs: 60 * 1000, keyPrefix: "pay-confirm" },
  /** Saldo payment endpoints - 5 req/min per user */
  PAYMENT_SALDO: { maxRequests: 5, windowMs: 60 * 1000, keyPrefix: "pay-saldo" },
  /** Webhook endpoints - 100 req/min per IP (Midtrans server callbacks) */
  WEBHOOK: { maxRequests: 100, windowMs: 60 * 1000, keyPrefix: "webhook" },
  /** General API endpoints - 30 req/min per user */
  GENERAL: { maxRequests: 30, windowMs: 60 * 1000, keyPrefix: "general" },
} as const;
