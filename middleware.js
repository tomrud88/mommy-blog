import { NextResponse } from "next/server";
import { applyRateLimit } from "@/utils/rateLimiter";
import { csrfMiddleware, CSRF_CONFIG } from "@/utils/csrf";

/**
 * Enhanced middleware for Next.js with Rate Limiting and CSRF Protection
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Skip middleware for static files and certain paths
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/auth/") || // NextAuth handles its own protection
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // CSRF Protection for state-changing operations
  const needsCSRFProtection =
    CSRF_CONFIG.PROTECTED_PATHS.some((path) => pathname.startsWith(path)) &&
    CSRF_CONFIG.PROTECTED_METHODS.includes(request.method);

  if (needsCSRFProtection) {
    try {
      const csrfResult = await csrfMiddleware(request);

      if (!csrfResult.valid) {
        return NextResponse.json(
          {
            error: "CSRF Protection",
            message: csrfResult.error,
            type: "CSRF_TOKEN_INVALID",
          },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error("CSRF middleware error:", error);
      return NextResponse.json(
        {
          error: "CSRF Protection",
          message: "CSRF validation failed. Please refresh and try again.",
          type: "CSRF_VALIDATION_ERROR",
        },
        { status: 403 }
      );
    }
  }

  try {
    // Determine rate limit type based on path
    let rateLimitType = "api";

    if (pathname.startsWith("/api/posts")) {
      rateLimitType = "posts";
    } else if (pathname.startsWith("/api/comments")) {
      rateLimitType = "comments";
    } else if (pathname.startsWith("/api/upload")) {
      rateLimitType = "upload";
    } else if (pathname.includes("/login") || pathname.includes("/auth")) {
      rateLimitType = "auth";
    }

    // Apply rate limiting
    const rateLimitResult = await applyRateLimit(request, rateLimitType);

    // Continue with the request, adding rate limit headers
    const response = NextResponse.next();

    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    // Rate limit exceeded
    if (error.status === 429) {
      const response = NextResponse.json(
        {
          error: "Too Many Requests",
          message: error.message,
          type: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );

      // Add rate limit headers
      if (error.headers) {
        Object.entries(error.headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      }

      return response;
    }

    // Other errors - continue normally but log
    console.error("Rate limiting middleware error:", error);
    return NextResponse.next();
  }
}

// Configure which paths this middleware should run on
export const config = {
  matcher: [
    // API routes
    "/api/:path*",
    // Auth pages
    "/login",
    "/register",
    // Admin pages
    "/write",
    // Content creation
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
