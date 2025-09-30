import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";

export const POST = async (req, { params }) => {
  const { postSlug } = params;

  console.log(`Attempting to increment views for post slug: ${postSlug}`);

  try {
    const updatedPost = await prisma.post.update({
      where: { slug: postSlug },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        slug: true,
        views: true,
        title: true,
      },
    });

    console.log(
      `Successfully incremented views for post: ${updatedPost.title}, new view count: ${updatedPost.views}`
    );

    return new NextResponse(
      JSON.stringify({
        success: true,
        post: updatedPost,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(`Error incrementing views for slug ${postSlug}:`, err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!", error: err.message }),
      { status: 500 }
    );
  }
};
