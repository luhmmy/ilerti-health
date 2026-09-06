// In-Memory & Database Sliding Window Rate Limiter for Next.js API Routes

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale records periodically
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((record, key) => {
    if (record.resetAt <= now) {
      rateLimitMap.delete(key);
    }
  });
}, 60 * 1000);

export interface RateLimitOptions {
  limit: number;       // Maximum requests allowed in the window
  windowSeconds: number; // Duration of window in seconds
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetSeconds: number;
  totalLimit: number;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 5, windowSeconds: 60 }
): RateLimitResult {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const key = identifier.toLowerCase().trim();

  const record = rateLimitMap.get(key);

  if (!record || record.resetAt <= now) {
    // New or expired window
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      success: true,
      remaining: options.limit - 1,
      resetSeconds: options.windowSeconds,
      totalLimit: options.limit,
    };
  }

  // Existing window
  if (record.count >= options.limit) {
    const resetSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      success: false,
      remaining: 0,
      resetSeconds,
      totalLimit: options.limit,
    };
  }

  // Increment within limit
  record.count += 1;
  const resetSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));

  return {
    success: true,
    remaining: options.limit - record.count,
    resetSeconds,
    totalLimit: options.limit,
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}
