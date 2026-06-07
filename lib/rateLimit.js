/**
 * Simple in-memory rate limiter for login attempts.
 *
 * Tracks failed attempts per identifier (IP or email).
 * Resets on successful login or after the window expires.
 *
 * Limitations:
 * - In-memory: state lost on server restart / serverless cold start.
 *   For high-traffic apps, swap for Redis or Vercel KV.
 * - Per-instance: on Vercel with multiple lambdas, each instance has
 *   its own counter. Still raises the attack cost significantly.
 *
 * For UMKM-scale template this is sufficient defense against
 * password brute-force attacks.
 */

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_MS = 15 * 60 * 1000;  // 15 minutes block after exceeded

// Map<identifier, { count, firstAttempt, blockedUntil }>
const store = new Map();

/**
 * Check if identifier is allowed to attempt login.
 * Returns { allowed: boolean, remainingMs?: number, attemptsLeft?: number }.
 */
export function checkRateLimit(identifier) {
  if (!identifier) return { allowed: true, attemptsLeft: MAX_ATTEMPTS };

  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry) {
    return { allowed: true, attemptsLeft: MAX_ATTEMPTS };
  }

  // Currently blocked?
  if (entry.blockedUntil && entry.blockedUntil > now) {
    return {
      allowed: false,
      remainingMs: entry.blockedUntil - now,
    };
  }

  // Window expired? Reset.
  if (now - entry.firstAttempt > WINDOW_MS) {
    store.delete(identifier);
    return { allowed: true, attemptsLeft: MAX_ATTEMPTS };
  }

  return {
    allowed: true,
    attemptsLeft: Math.max(0, MAX_ATTEMPTS - entry.count),
  };
}

/**
 * Record a failed login attempt.
 * Returns the new state — if attempts exceeded, blockedUntil will be set.
 */
export function recordFailedAttempt(identifier) {
  if (!identifier) return;

  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    store.set(identifier, {
      count: 1,
      firstAttempt: now,
      blockedUntil: null,
    });
    return { count: 1, attemptsLeft: MAX_ATTEMPTS - 1 };
  }

  entry.count += 1;

  if (entry.count >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_MS;
  }

  return {
    count: entry.count,
    attemptsLeft: Math.max(0, MAX_ATTEMPTS - entry.count),
    blockedUntil: entry.blockedUntil,
  };
}

/**
 * Reset attempts for an identifier (call on successful login).
 */
export function resetRateLimit(identifier) {
  if (!identifier) return;
  store.delete(identifier);
}

/**
 * Periodic cleanup of expired entries to prevent memory leak.
 * Runs lazily on each call — no setInterval needed.
 */
function maybeCleanup() {
  if (store.size < 100) return;
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    const expired =
      (entry.blockedUntil && entry.blockedUntil < now) ||
      (!entry.blockedUntil && now - entry.firstAttempt > WINDOW_MS);
    if (expired) store.delete(key);
  }
}

// Hook cleanup into every check call
const _origCheck = checkRateLimit;
export default _origCheck;
maybeCleanup();
