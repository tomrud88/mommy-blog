/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or external service
 */

class MemoryRateLimiter {
  constructor() {
    this.clients = new Map();
    this.cleanup();
  }

  /**
   * Check if request is allowed
   * @param {string} identifier - Usually IP address or user ID
   * @param {number} limit - Number of requests allowed
   * @param {number} window - Time window in milliseconds
   * @returns {object} - { success: boolean, limit, remaining, reset }
   */
  async check(identifier, limit = 10, window = 60000) {
    const now = Date.now();
    const client = this.clients.get(identifier) || {
      count: 0,
      resetTime: now + window,
      requests: [],
    };

    // Remove old requests outside the window
    client.requests = client.requests.filter((time) => now - time < window);

    // Check if limit exceeded
    if (client.requests.length >= limit) {
      const oldestRequest = Math.min(...client.requests);
      const resetTime = oldestRequest + window;

      return {
        success: false,
        limit,
        remaining: 0,
        reset: resetTime,
        retryAfter: Math.ceil((resetTime - now) / 1000),
      };
    }

    // Add current request
    client.requests.push(now);
    this.clients.set(identifier, client);

    return {
      success: true,
      limit,
      remaining: limit - client.requests.length,
      reset: now + window,
    };
  }

  /**
   * Clean up old entries every 5 minutes
   */
  cleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [identifier, client] of this.clients.entries()) {
        // Remove entries older than 1 hour
        if (
          client.requests.length === 0 ||
          now - Math.max(...client.requests) > 3600000
        ) {
          this.clients.delete(identifier);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Get current status for identifier
   */
  getStatus(identifier) {
    const client = this.clients.get(identifier);
    if (!client) return null;

    const now = Date.now();
    const activeRequests = client.requests.filter((time) => now - time < 60000);

    return {
      requests: activeRequests.length,
      lastRequest:
        client.requests.length > 0 ? Math.max(...client.requests) : null,
    };
  }

  /**
   * Reset limits for identifier (useful for testing)
   */
  reset(identifier) {
    this.clients.delete(identifier);
  }

  /**
   * Get all active clients (for monitoring)
   */
  getStats() {
    const stats = {
      totalClients: this.clients.size,
      activeClients: 0,
      totalRequests: 0,
    };

    const now = Date.now();
    for (const client of this.clients.values()) {
      const activeRequests = client.requests.filter(
        (time) => now - time < 60000
      );
      if (activeRequests.length > 0) {
        stats.activeClients++;
        stats.totalRequests += activeRequests.length;
      }
    }

    return stats;
  }
}

// Global instance
const rateLimiter = new MemoryRateLimiter();

/**
 * Rate limiting configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Authentication endpoints - stricter limits
  auth: {
    limit: 5, // 5 attempts
    window: 15 * 60 * 1000, // per 15 minutes
  },

  // Content creation - moderate limits
  posts: {
    limit: 5, // 5 posts
    window: 60 * 60 * 1000, // per hour
  },

  // Comments - moderate limits
  comments: {
    limit: 10, // 10 comments
    window: 10 * 60 * 1000, // per 10 minutes
  },

  // General API - generous limits
  api: {
    limit: 100, // 100 requests
    window: 60 * 1000, // per minute
  },

  // File uploads - strict limits
  upload: {
    limit: 3, // 3 uploads
    window: 5 * 60 * 1000, // per 5 minutes
  },
};

/**
 * Apply rate limiting to a request
 * @param {Request} request - The request object
 * @param {string} type - Rate limit type from RATE_LIMITS
 * @param {string} customIdentifier - Custom identifier (optional)
 */
export async function applyRateLimit(
  request,
  type = "api",
  customIdentifier = null
) {
  // Get client identifier
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";

  const identifier = customIdentifier || `${type}_${ip.split(",")[0].trim()}`;

  // Get rate limit config
  const config = RATE_LIMITS[type] || RATE_LIMITS.api;

  // Check rate limit
  const result = await rateLimiter.check(
    identifier,
    config.limit,
    config.window
  );

  if (!result.success) {
    const error = new Error(
      `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`
    );
    error.status = 429;
    error.headers = {
      "X-RateLimit-Limit": config.limit.toString(),
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": new Date(result.reset).toISOString(),
      "Retry-After": result.retryAfter.toString(),
    };
    throw error;
  }

  return {
    headers: {
      "X-RateLimit-Limit": config.limit.toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Reset": new Date(result.reset).toISOString(),
    },
  };
}

export default rateLimiter;
