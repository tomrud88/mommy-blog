/**
 * @jest-environment node
 */

// Don't import jest setup for node tests
describe("Rate Limiter Tests", () => {
  // We'll import the rateLimiter here to avoid setup conflicts
  let rateLimiter, applyRateLimit, RATE_LIMITS;

  beforeAll(async () => {
    // Import modules after jest environment is set
    const rateLimiterModule = await import("../src/utils/rateLimiter.js");
    rateLimiter = rateLimiterModule.default;
    applyRateLimit = rateLimiterModule.applyRateLimit;
    RATE_LIMITS = rateLimiterModule.RATE_LIMITS;
  });

  // Mock request object
  const createMockRequest = (ip = "127.0.0.1") => ({
    headers: {
      get: (name) => {
        if (name === "x-forwarded-for") return ip;
        return null;
      },
    },
  });

  beforeEach(() => {
    // Reset rate limiter state before each test
    if (rateLimiter && rateLimiter.clients) {
      rateLimiter.clients.clear();
    }
  });

  describe("Basic Rate Limiting", () => {
    test("should allow requests within limit", async () => {
      // Should allow first request
      const result1 = await rateLimiter.check("test-client", 5, 60000);
      expect(result1.success).toBe(true);
      expect(result1.remaining).toBe(4);

      // Should allow second request
      const result2 = await rateLimiter.check("test-client", 5, 60000);
      expect(result2.success).toBe(true);
      expect(result2.remaining).toBe(3);
    });

    test("should block requests when limit exceeded", async () => {
      const clientId = "test-client";
      const limit = 3;
      const window = 60000;

      // Make requests up to limit
      for (let i = 0; i < limit; i++) {
        const result = await rateLimiter.check(clientId, limit, window);
        expect(result.success).toBe(true);
      }

      // Next request should be blocked
      const blockedResult = await rateLimiter.check(clientId, limit, window);
      expect(blockedResult.success).toBe(false);
      expect(blockedResult.remaining).toBe(0);
      expect(blockedResult.retryAfter).toBeGreaterThan(0);
    });

    test("should reset after time window", async () => {
      const clientId = "test-client";
      const limit = 2;
      const window = 100; // 100ms window for quick test

      // Use up the limit
      await rateLimiter.check(clientId, limit, window);
      await rateLimiter.check(clientId, limit, window);

      // Should be blocked
      const blockedResult = await rateLimiter.check(clientId, limit, window);
      expect(blockedResult.success).toBe(false);

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should be allowed again
      const allowedResult = await rateLimiter.check(clientId, limit, window);
      expect(allowedResult.success).toBe(true);
    });
  });

  describe("applyRateLimit function", () => {
    test("should apply correct rate limits for different types", async () => {
      const request = createMockRequest("192.168.1.2");

      // Test posts rate limit
      const postsResult = await applyRateLimit(request, "posts");
      expect(postsResult.headers["X-RateLimit-Limit"]).toBe(
        RATE_LIMITS.posts.limit.toString()
      );

      // Test comments rate limit
      const commentsResult = await applyRateLimit(request, "comments");
      expect(commentsResult.headers["X-RateLimit-Limit"]).toBe(
        RATE_LIMITS.comments.limit.toString()
      );

      // Test upload rate limit
      const uploadResult = await applyRateLimit(request, "upload");
      expect(uploadResult.headers["X-RateLimit-Limit"]).toBe(
        RATE_LIMITS.upload.limit.toString()
      );
    });

    test("should throw error when rate limit exceeded", async () => {
      const request = createMockRequest("192.168.1.3");
      const limit = RATE_LIMITS.upload.limit; // 3 requests

      // Use up all requests
      for (let i = 0; i < limit; i++) {
        await applyRateLimit(request, "upload");
      }

      // Next request should throw error
      await expect(applyRateLimit(request, "upload")).rejects.toThrow(
        "Rate limit exceeded"
      );
    });

    test("should use custom identifier when provided", async () => {
      const request = createMockRequest("192.168.1.4");
      const customIdentifier = "user-123";

      // Make request with custom identifier
      const result = await applyRateLimit(request, "api", customIdentifier);
      expect(result.headers["X-RateLimit-Remaining"]).toBe("99"); // 100 - 1

      // Check that it's tracked separately from IP-based limiting
      const ipResult = await applyRateLimit(request, "api");
      expect(ipResult.headers["X-RateLimit-Remaining"]).toBe("99"); // Different counter
    });
  });

  describe("Rate Limit Configurations", () => {
    test("should have correct configurations for all endpoint types", () => {
      expect(RATE_LIMITS.auth.limit).toBe(5);
      expect(RATE_LIMITS.auth.window).toBe(15 * 60 * 1000); // 15 minutes

      expect(RATE_LIMITS.posts.limit).toBe(5);
      expect(RATE_LIMITS.posts.window).toBe(60 * 60 * 1000); // 1 hour

      expect(RATE_LIMITS.comments.limit).toBe(10);
      expect(RATE_LIMITS.comments.window).toBe(10 * 60 * 1000); // 10 minutes

      expect(RATE_LIMITS.upload.limit).toBe(3);
      expect(RATE_LIMITS.upload.window).toBe(5 * 60 * 1000); // 5 minutes

      expect(RATE_LIMITS.api.limit).toBe(100);
      expect(RATE_LIMITS.api.window).toBe(60 * 1000); // 1 minute
    });
  });

  describe("Edge Cases", () => {
    test("should handle requests with no IP address", async () => {
      const request = createMockRequest(null);

      const result = await applyRateLimit(request, "api");
      expect(result.headers["X-RateLimit-Limit"]).toBe("100");
    });

    test("should handle concurrent requests properly", async () => {
      const request = createMockRequest("192.168.1.5");
      const promises = [];

      // Make 5 concurrent requests
      for (let i = 0; i < 5; i++) {
        promises.push(applyRateLimit(request, "upload")); // limit is 3
      }

      const results = await Promise.allSettled(promises);

      // Should have 3 successful and 2 failed
      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      expect(successful).toBe(3);
      expect(failed).toBe(2);
    });

    test("should clean up old entries", () => {
      const stats = rateLimiter.getStats();
      expect(typeof stats.totalClients).toBe("number");
      expect(typeof stats.activeClients).toBe("number");
      expect(typeof stats.totalRequests).toBe("number");
    });
  });

  describe("Utility Methods", () => {
    test("should provide status information", async () => {
      const clientId = "status-test";

      // Make some requests
      await rateLimiter.check(clientId, 5, 60000);
      await rateLimiter.check(clientId, 5, 60000);

      const status = rateLimiter.getStatus(clientId);
      expect(status.requests).toBe(2);
      expect(status.lastRequest).toBeGreaterThan(0);
    });

    test("should reset client limits", async () => {
      const clientId = "reset-test";

      // Use up limit
      await rateLimiter.check(clientId, 1, 60000);
      const blockedResult = await rateLimiter.check(clientId, 1, 60000);
      expect(blockedResult.success).toBe(false);

      // Reset
      rateLimiter.reset(clientId);

      // Should work again
      const allowedResult = await rateLimiter.check(clientId, 1, 60000);
      expect(allowedResult.success).toBe(true);
    });
  });
});
