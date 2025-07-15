/**
 * Rate Limiter Service for Socket.io Events
 * Prevents abuse and spam by limiting the frequency of socket events per client
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class SocketRateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 30, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    
    // Clean up expired entries every minute
    setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Check if a client has exceeded their rate limit
   * @param clientId - Unique identifier for the client (usually socket.id)
   * @returns True if the request is allowed, false if rate limit exceeded
   */
  checkLimit(clientId: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(clientId);

    if (!entry) {
      // First request from this client
      this.limits.set(clientId, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (now > entry.resetTime) {
      // Window has expired, reset counter
      entry.count = 1;
      entry.resetTime = now + this.windowMs;
      return true;
    }

    if (entry.count >= this.maxRequests) {
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
  getRemainingRequests(clientId: string): number {
    const entry = this.limits.get(clientId);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [clientId, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(clientId);
      }
    }
  }
} 