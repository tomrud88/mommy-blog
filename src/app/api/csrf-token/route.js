import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { getCSRFTokenForSession } from "@/utils/csrf";

/**
 * API endpoint to get CSRF token for authenticated users
 * GET /api/csrf-token
 */
export async function GET(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to get CSRF token",
        },
        { status: 401 }
      );
    }

    // Generate CSRF token for current session
    const csrfToken = await getCSRFTokenForSession(request);

    if (!csrfToken) {
      return NextResponse.json(
        {
          error: "Token Generation Failed",
          message: "Could not generate CSRF token",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      csrfToken,
      expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      user: {
        email: session.user.email,
        role: session.user.role,
      },
    });
  } catch (error) {
    console.error("CSRF token generation error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to generate CSRF token",
      },
      { status: 500 }
    );
  }
}
