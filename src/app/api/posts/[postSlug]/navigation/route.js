import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";

// Get previous and next posts for navigation
export const GET = async (req, { params }) => {
  const { postSlug } = params;

  try {
    // First, get the current post to get its creation date
    const currentPost = await prisma.post.findUnique({
      where: { slug: postSlug },
      select: { id: true, createdAt: true }
    });

    if (!currentPost) {
      return new NextResponse(
        JSON.stringify({ message: "Post not found" }), 
        { status: 404 }
      );
    }

    // Get previous post (older)
    const previousPost = await prisma.post.findFirst({
      where: {
        createdAt: {
          lt: currentPost.createdAt
        }
      },
      select: {
        slug: true,
        title: true,
        img: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get next post (newer)
    const nextPost = await prisma.post.findFirst({
      where: {
        createdAt: {
          gt: currentPost.createdAt
        }
      },
      select: {
        slug: true,
        title: true,
        img: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return new NextResponse(JSON.stringify({
      previous: previousPost,
      next: nextPost
    }), { status: 200 });

  } catch (err) {
    console.error("Error fetching navigation:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }), 
      { status: 500 }
    );
  }
};