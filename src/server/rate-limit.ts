/**
 * Sliding-window rate limiter for the lead endpoint (TZ flow F-02, doc 16 §6).
 * In-memory and therefore per-instance — correct for a single-region
 * deployment; swap the internals for Redis when the hosting topology
 * (TZ doc 15/19) introduces multiple instances. The exported signature is
 * the stable contract.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const SWEEP_EVERY = 200;

/** Longest window any caller has configured, so sweeping never drops a
 *  timestamp another limiter still needs. */
let widestWindowMs = WINDOW_MS;

export interface RateLimitOptions {
  /** Sliding window length in ms. Defaults to 10 minutes. */
  windowMs?: number;
  /** Requests permitted per window. Defaults to 5. */
  max?: number;
}

const hits = new Map<string, number[]>();
let requestsSinceSweep = 0;

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function checkRateLimit(
  key: string,
  now: number = Date.now(),
  options: RateLimitOptions = {},
): RateLimitResult {
  const windowMs = options.windowMs ?? WINDOW_MS;
  const max = options.max ?? MAX_PER_WINDOW;
  if (windowMs > widestWindowMs) widestWindowMs = windowMs;

  sweep(now);

  const windowStart = now - windowMs;
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (recent.length >= max) {
    hits.set(key, recent);
    const oldest = recent[0];
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((oldest + windowMs - now) / 1000),
    };
  }

  recent.push(now);
  hits.set(key, recent);
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Periodically drops stale keys so the map cannot grow unbounded. */
function sweep(now: number): void {
  requestsSinceSweep += 1;
  if (requestsSinceSweep < SWEEP_EVERY) return;
  requestsSinceSweep = 0;
  const windowStart = now - widestWindowMs;
  for (const [key, timestamps] of hits) {
    const recent = timestamps.filter((t) => t > windowStart);
    if (recent.length === 0) {
      hits.delete(key);
    } else {
      hits.set(key, recent);
    }
  }
}
