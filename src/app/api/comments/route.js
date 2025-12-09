import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/utils/auth";
import { applyRateLimit } from "@/utils/rateLimiter";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const postSlug = searchParams.get("postSlug");

  try {
    const comments = await prisma.comment.findMany({
      where: {
        ...(postSlug && { postSlug }),
      },
      include: {
        user: true,
      },
    });

    return new NextResponse(JSON.stringify(comments), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  // SECURITY: Apply rate limiting for comments
  try {
    await applyRateLimit(req, "comments");
  } catch (error) {
    if (error.status === 429) {
      const response = NextResponse.json(
        {
          error: "Too Many Requests",
          message: "Zbyt wiele komentarzy. Spróbuj ponownie za chwilę.",
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
    console.error("Rate limiting error:", error);
  }

  console.log("post request");

  try {
    const session = await getAuthSession(req);
    console.log("Session:", session);

    if (!session) {
      console.log("Not Authenticated");
      return new NextResponse(
        JSON.stringify({ message: "Not Authenticated!" }),
        {
          status: 401,
        }
      );
    }

    const body = await req.json();
    console.log("Request body:", body);

    const comment = await prisma.comment.create({
      data: { ...body, userEmail: session.user.email },
    });
    console.log("Comment created:", comment);

    return new NextResponse(JSON.stringify(comment), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get("commentId");

  try {
    const session = await getAuthSession(req);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ message: "Not Authenticated!" }),
        {
          status: 401,
        }
      );
    }

    // Find the comment to check ownership
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return new NextResponse(
        JSON.stringify({ message: "Comment not found!" }),
        {
          status: 404,
        }
      );
    }

    // Check if user is the author of the comment
    if (comment.userEmail !== session.user.email) {
      return new NextResponse(
        JSON.stringify({ message: "Not authorized to delete this comment!" }),
        {
          status: 403,
        }
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return new NextResponse(
      JSON.stringify({ message: "Comment deleted successfully!" }),
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
