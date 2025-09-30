import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  console.log("Fetching popular posts by category...");

  try {
    // Get the 4 main categories
    const categories = ["mama", "dziecko", "zabawy", "książki"];

    // For each category, get the most popular post (highest views)
    const popularPostsByCategory = await Promise.all(
      categories.map(async (catSlug) => {
        const post = await prisma.post.findFirst({
          where: {
            catSlug: catSlug,
          },
          orderBy: {
            views: "desc", // Get the one with most views in this category
          },
          include: {
            cat: true,
          },
        });
        return post;
      })
    );

    // Filter out any null results (in case a category has no posts)
    const validPosts = popularPostsByCategory.filter((post) => post !== null);

    console.log(
      "Popular posts with view counts:",
      validPosts.map((p) => ({
        title: p.title,
        views: p.views,
        category: p.cat.title,
      }))
    );

    return new NextResponse(JSON.stringify(validPosts), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
