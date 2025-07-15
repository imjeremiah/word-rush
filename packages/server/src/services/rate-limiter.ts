/**
 * Rate Limiter Service for Socket.io Events
 * Prevents abuse and spam by limiting the frequency of socket events per client
 */

/**
 * Rate limit entry for tracking client request counts
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Rate limiter module interface
 */
interface RateLimiterModule {
  checkLimit: (clientId: string) => boolean;
  getRemainingRequests: (clientId: string) => number;
  cleanup: () => void;
}

/**
 * Create a rate limiter service for socket events
 * @param maxRequests - Maximum number of requests per time window (default: 30)
 * @param windowMs - Time window in milliseconds (default: 60000ms = 1 minute)
 * @returns Rate limiter module with functions for checking limits
 */
function createSocketRateLimiter(maxRequests: number = 30, windowMs: number = 60000): RateLimiterModule {
  const limits: Map<string, RateLimitEntry> = new Map();
  
  /**
   * Clean up expired entries to prevent memory leaks
   */
  function cleanup(): void {
    const now = Date.now();
    for (const [clientId, entry] of limits.entries()) {
      if (now > entry.resetTime) {
        limits.delete(clientId);
      }
    }
  }

  /**
   * Check if a client has exceeded their rate limit
   * @param clientId - Unique identifier for the client (usually socket.id)
   * @returns True if the request is allowed, false if rate limit exceeded
   */
  function checkLimit(clientId: string): boolean {
    const now = Date.now();
    const entry = limits.get(clientId);

    if (!entry) {
      // First request from this client
      limits.set(clientId, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    if (now > entry.resetTime) {
      // Window has expired, reset counter
      entry.count = 1;
      entry.resetTime = now + windowMs;
      return true;
    }

    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      return false;
    }

    // Increment counter
    entry.count++;
    return true;
  }

  /**
   * Get remaining requests for a client in the current window
   * @param clientId - Unique identifier for the client (usually socket.id)
   * @returns Number of requests remaining in the current rate limit window
   */
  function getRemainingRequests(clientId: string): number {
    const entry = limits.get(clientId);
    if (!entry || Date.now() > entry.resetTime) {
      return maxRequests;
    }
    return Math.max(0, maxRequests - entry.count);
  }

  // Set up periodic cleanup to prevent memory leaks
  const cleanupInterval = setInterval(cleanup, 60000);

  // Return the public API with cleanup capability
  return {
    checkLimit,
    getRemainingRequests,
    cleanup: () => {
      cleanup();
      clearInterval(cleanupInterval);
    },
  };
}

// Create and export the rate limiter service instance
export const socketRateLimiter = createSocketRateLimiter(); 