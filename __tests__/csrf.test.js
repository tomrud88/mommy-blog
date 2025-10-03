/**
 * @jest-environment node
 */

describe("CSRF Protection Tests", () => {
  let csrfUtils;

  beforeAll(async () => {
    // Import modules after jest environment is set
    const csrfModule = await import("../src/utils/csrf.js");
    csrfUtils = csrfModule;
  });

  describe("CSRF Token Generation", () => {
    test("should generate unique CSRF tokens", () => {
      const token1 = csrfUtils.generateCSRFToken();
      const token2 = csrfUtils.generateCSRFToken();

      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      expect(token1).not.toBe(token2);
      expect(token1.length).toBe(64); // 32 bytes * 2 hex chars
    });

    test("should create signed CSRF token with session", () => {
      const sessionId = "user123@example.com";
      const secret = "test-secret-key";

      const token = csrfUtils.createCSRFToken(sessionId, secret);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    test("should verify valid CSRF tokens", () => {
      const sessionId = "user123@example.com";
      const secret = "test-secret-key";

      const token = csrfUtils.createCSRFToken(sessionId, secret);
      const isValid = csrfUtils.verifyCSRFToken(token, sessionId, secret);

      expect(isValid).toBe(true);
    });

    test("should reject invalid CSRF tokens", () => {
      const sessionId = "user123@example.com";
      const secret = "test-secret-key";

      const validToken = csrfUtils.createCSRFToken(sessionId, secret);

      // Test with wrong session
      expect(
        csrfUtils.verifyCSRFToken(validToken, "wrong@example.com", secret)
      ).toBe(false);

      // Test with wrong secret
      expect(
        csrfUtils.verifyCSRFToken(validToken, sessionId, "wrong-secret")
      ).toBe(false);

      // Test with malformed token
      expect(
        csrfUtils.verifyCSRFToken("invalid-token", sessionId, secret)
      ).toBe(false);

      // Test with empty token
      expect(csrfUtils.verifyCSRFToken("", sessionId, secret)).toBe(false);
      expect(csrfUtils.verifyCSRFToken(null, sessionId, secret)).toBe(false);
    });

    test("should reject expired CSRF tokens", () => {
      const sessionId = "user123@example.com";
      const secret = "test-secret-key";
      const maxAge = 100; // 100ms

      const token = csrfUtils.createCSRFToken(sessionId, secret);

      // Should be valid immediately
      expect(csrfUtils.verifyCSRFToken(token, sessionId, secret, maxAge)).toBe(
        true
      );

      // Wait for expiry and test again
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(
            csrfUtils.verifyCSRFToken(token, sessionId, secret, maxAge)
          ).toBe(false);
          resolve();
        }, 150);
      });
    });
  });

  describe("CSRF Configuration", () => {
    test("should have correct CSRF configuration", () => {
      expect(csrfUtils.CSRF_CONFIG.TOKEN_EXPIRY).toBe(60 * 60 * 1000); // 1 hour
      expect(csrfUtils.CSRF_CONFIG.HEADER_NAME).toBe("X-CSRF-Token");
      expect(csrfUtils.CSRF_CONFIG.FIELD_NAME).toBe("csrfToken");

      expect(csrfUtils.CSRF_CONFIG.PROTECTED_PATHS).toContain("/api/posts");
      expect(csrfUtils.CSRF_CONFIG.PROTECTED_PATHS).toContain("/api/comments");
      expect(csrfUtils.CSRF_CONFIG.PROTECTED_PATHS).toContain("/api/upload");

      expect(csrfUtils.CSRF_CONFIG.PROTECTED_METHODS).toContain("POST");
      expect(csrfUtils.CSRF_CONFIG.PROTECTED_METHODS).toContain("PUT");
      expect(csrfUtils.CSRF_CONFIG.PROTECTED_METHODS).toContain("DELETE");
    });
  });

  describe("Edge Cases", () => {
    test("should handle malformed base64 tokens", () => {
      const sessionId = "user123@example.com";
      const secret = "test-secret-key";

      // Test with invalid base64
      expect(
        csrfUtils.verifyCSRFToken("not-base64!@#", sessionId, secret)
      ).toBe(false);

      // Test with valid base64 but wrong format
      const invalidToken = Buffer.from("wrong:format").toString("base64");
      expect(csrfUtils.verifyCSRFToken(invalidToken, sessionId, secret)).toBe(
        false
      );
    });

    test("should handle timing attack prevention", () => {
      const sessionId = "user123@example.com";
      const secret = "test-secret-key";

      const token = csrfUtils.createCSRFToken(sessionId, secret);

      // Test multiple times to ensure consistent timing
      const startTime = Date.now();
      for (let i = 0; i < 100; i++) {
        csrfUtils.verifyCSRFToken(token, sessionId, secret);
      }
      const validTime = Date.now() - startTime;

      const startTime2 = Date.now();
      for (let i = 0; i < 100; i++) {
        csrfUtils.verifyCSRFToken("invalid-token", sessionId, secret);
      }
      const invalidTime = Date.now() - startTime2;

      // Times should be relatively similar (timing attack prevention)
      const timeDifference = Math.abs(validTime - invalidTime);
      expect(timeDifference).toBeLessThan(1000); // Less than 1 second difference
    });

    test("should generate meta tags correctly", () => {
      const token = "test-csrf-token-123";
      const metaTags = csrfUtils.generateCSRFMetaTags(token);

      expect(metaTags).toBe(
        '<meta name="csrf-token" content="test-csrf-token-123">'
      );
    });
  });

  describe("Security Tests", () => {
    test("should prevent token reuse across different sessions", () => {
      const secret = "test-secret-key";
      const session1 = "user1@example.com";
      const session2 = "user2@example.com";

      const token1 = csrfUtils.createCSRFToken(session1, secret);

      // Token should be valid for session1
      expect(csrfUtils.verifyCSRFToken(token1, session1, secret)).toBe(true);

      // Token should NOT be valid for session2
      expect(csrfUtils.verifyCSRFToken(token1, session2, secret)).toBe(false);
    });

    test("should prevent token forgery without secret", () => {
      const sessionId = "user123@example.com";
      const realSecret = "real-secret-key";
      const fakeSecret = "fake-secret-key";

      const realToken = csrfUtils.createCSRFToken(sessionId, realSecret);
      const fakeToken = csrfUtils.createCSRFToken(sessionId, fakeSecret);

      // Real token should work with real secret
      expect(csrfUtils.verifyCSRFToken(realToken, sessionId, realSecret)).toBe(
        true
      );

      // Fake token should NOT work with real secret
      expect(csrfUtils.verifyCSRFToken(fakeToken, sessionId, realSecret)).toBe(
        false
      );

      // Real token should NOT work with fake secret
      expect(csrfUtils.verifyCSRFToken(realToken, sessionId, fakeSecret)).toBe(
        false
      );
    });

    test("should handle concurrent token validation", async () => {
      const sessionId = "user123@example.com";
      const secret = "test-secret-key";
      const token = csrfUtils.createCSRFToken(sessionId, secret);

      // Create multiple concurrent validation promises
      const validationPromises = Array(10)
        .fill()
        .map(() =>
          Promise.resolve(csrfUtils.verifyCSRFToken(token, sessionId, secret))
        );

      const results = await Promise.all(validationPromises);

      // All should return true
      results.forEach((result) => {
        expect(result).toBe(true);
      });
    });
  });
});
