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

const hits = new Map<string, number[]>();
let requestsSinceSweep = 0;

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function checkRateLimit(
  key: string,
  now: number = Date.now(),
): RateLimitResult {
  sweep(now);

  const windowStart = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    const oldest = recent[0];
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((oldest + WINDOW_MS - now) / 1000),
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
  const windowStart = now - WINDOW_MS;
  for (const [key, timestamps] of hits) {
    const recent = timestamps.filter((t) => t > windowStart);
    if (recent.length === 0) {
      hits.delete(key);
    } else {
      hits.set(key, recent);
    }
  }
}
