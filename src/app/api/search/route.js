import { NextResponse } from "next/server";
import { prisma } from "@/utils/connect";
import { applyRateLimit } from "@/utils/rateLimiter";

export const GET = async (req) => {
  try {
    // Apply rate limiting for search
    await applyRateLimit(req, "api");

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Zapytanie musi mieć co najmniej 2 znaki" },
        { status: 400 }
      );
    }

    const searchTerm = query.trim();
    console.log("Search term:", searchTerm);

    // Search in posts by title and description
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            desc: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit results to prevent performance issues
    });

    console.log("Found posts:", posts.length);

    // Format the response
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      desc: post.desc,
      img: post.img,
      slug: post.slug,
      createdAt: post.createdAt,
      // Highlight matching text in description (simple implementation)
      highlightedDesc: post.desc
        ? highlightSearchTerm(post.desc, searchTerm)
        : null,
    }));

    return NextResponse.json({
      posts: formattedPosts,
      totalResults: formattedPosts.length,
      query: searchTerm,
    });
  } catch (error) {
    console.error("Search API error:", error);

    // Handle rate limiting errors
    if (error.status === 429) {
      return NextResponse.json(
        { error: "Zbyt wiele żądań. Spróbuj ponownie za chwilę." },
        {
          status: 429,
          headers: error.headers || {},
        }
      );
    }

    return NextResponse.json(
      { error: "Wystąpił błąd podczas wyszukiwania" },
      { status: 500 }
    );
  }
};

// Helper function to highlight search terms in text
function highlightSearchTerm(text, searchTerm) {
  if (!text || !searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}
