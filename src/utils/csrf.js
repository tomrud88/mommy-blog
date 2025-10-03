/**
 * CSRF Protection Utility
 * Generates and validates CSRF tokens to prevent Cross-Site Request Forgery attacks
 */

import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Generate a cryptographically secure CSRF token
 * @returns {string} - 64 character hex token
 */
export function generateCSRFToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Create CSRF token tied to user session
 * @param {string} sessionId - User session identifier
 * @param {string} secret - Secret key for signing (from env)
 * @returns {string} - Signed CSRF token
 */
export function createCSRFToken(
  sessionId,
  secret = process.env.NEXTAUTH_SECRET
) {
  const timestamp = Date.now().toString();
  const randomPart = generateCSRFToken();
  const payload = `${sessionId}:${timestamp}:${randomPart}`;

  // Create HMAC signature
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  // Combine payload and signature
  const token = Buffer.from(`${payload}:${signature}`).toString("base64");
  return token;
}

/**
 * Verify CSRF token against session
 * @param {string} token - Token to verify
 * @param {string} sessionId - Current session ID
 * @param {string} secret - Secret key for verification
 * @param {number} maxAge - Maximum token age in milliseconds (default: 1 hour)
 * @returns {boolean} - True if token is valid
 */
export function verifyCSRFToken(
  token,
  sessionId,
  secret = process.env.NEXTAUTH_SECRET,
  maxAge = 60 * 60 * 1000 // 1 hour
) {
  try {
    if (!token || !sessionId) {
      return false;
    }

    // Decode base64 token
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const parts = decoded.split(":");

    if (parts.length !== 4) {
      return false;
    }

    const [tokenSessionId, timestamp, randomPart, signature] = parts;

    // Check if session matches
    if (tokenSessionId !== sessionId) {
      return false;
    }

    // Check if token is not expired
    const tokenTime = parseInt(timestamp);
    if (Date.now() - tokenTime > maxAge) {
      return false;
    }

    // Verify signature
    const payload = `${tokenSessionId}:${timestamp}:${randomPart}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch (error) {
    console.error("CSRF token verification error:", error);
    return false;
  }
}

/**
 * Get CSRF token for current session
 * @param {Request} request - Next.js request object
 * @returns {Promise<string|null>} - CSRF token or null if no session
 */
export async function getCSRFTokenForSession(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return null;
    }

    // Use user email as session identifier (stable across requests)
    const sessionId = session.user.email;
    return createCSRFToken(sessionId);
  } catch (error) {
    console.error("Error getting CSRF token for session:", error);
    return null;
  }
}

/**
 * Validate CSRF token from request
 * @param {Request} request - Next.js request object
 * @param {string} submittedToken - Token from form/header
 * @returns {Promise<boolean>} - True if token is valid
 */
export async function validateCSRFToken(request, submittedToken) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !submittedToken) {
      return false;
    }

    const sessionId = session.user.email;
    return verifyCSRFToken(submittedToken, sessionId);
  } catch (error) {
    console.error("Error validating CSRF token:", error);
    return false;
  }
}

/**
 * Middleware function to check CSRF token
 * @param {Request} request - Next.js request object
 * @param {string} tokenSource - Where to get token from ('header' or 'body')
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
export async function csrfMiddleware(request, tokenSource = "body") {
  try {
    let submittedToken;

    if (tokenSource === "header") {
      submittedToken = request.headers.get("x-csrf-token");
    } else {
      // For JSON data - clone request to read body multiple times
      const clonedRequest = request.clone();

      try {
        const body = await clonedRequest.json();
        submittedToken = body.csrfToken;
      } catch (e) {
        // If not JSON, try form data
        try {
          const formData = await request.formData();
          submittedToken = formData.get("csrfToken");
        } catch (e2) {
          // No valid data found
          submittedToken = null;
        }
      }
    }

    const isValid = await validateCSRFToken(request, submittedToken);

    if (!isValid) {
      return {
        valid: false,
        error: "CSRF token mismatch. Please refresh the page and try again.",
      };
    }

    return { valid: true };
  } catch (error) {
    console.error("CSRF middleware error:", error);
    return {
      valid: false,
      error: "CSRF validation failed. Please try again.",
    };
  }
}

/**
 * Generate CSRF meta tags for HTML head
 * @param {string} token - CSRF token
 * @returns {string} - HTML meta tags
 */
export function generateCSRFMetaTags(token) {
  return `<meta name="csrf-token" content="${token}">`;
}

/**
 * CSRF configuration
 */
export const CSRF_CONFIG = {
  // Token expiry time (1 hour)
  TOKEN_EXPIRY: 60 * 60 * 1000,

  // Header name for CSRF token
  HEADER_NAME: "X-CSRF-Token",

  // Form field name for CSRF token
  FIELD_NAME: "csrfToken",

  // Paths that require CSRF protection
  PROTECTED_PATHS: [
    "/api/posts",
    "/api/comments",
    "/api/upload",
    "/api/users",
    "/api/admin",
  ],

  // Methods that require CSRF protection
  PROTECTED_METHODS: ["POST", "PUT", "DELETE", "PATCH"],
};
