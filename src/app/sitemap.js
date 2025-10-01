import { getApiUrl } from "@/utils/getBaseUrl";

export default async function sitemap() {
  const baseUrl = "https://mommy-blog.vercel.app";

  // Static pages
  const staticPages = ["", "/about"];

  const staticUrls = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? "daily" : "monthly",
    priority: page === "" ? 1 : 0.8,
  }));

  try {
    // Get all posts
    const postsRes = await fetch(getApiUrl("/posts?page=1&limit=1000"), {
      next: { revalidate: 3600 },
    });

    let postUrls = [];
    if (postsRes.ok) {
      const postsData = await postsRes.json();
      postUrls =
        postsData.posts?.map((post) => ({
          url: `${baseUrl}/posts/${post.slug}`,
          lastModified: new Date(post.createdAt),
          changeFrequency: "weekly",
          priority: 0.7,
        })) || [];
    }

    // Get all categories
    const categoriesRes = await fetch(getApiUrl("/categories"), {
      next: { revalidate: 3600 },
    });

    let categoryUrls = [];
    if (categoriesRes.ok) {
      const categories = await categoriesRes.json();
      categoryUrls =
        categories?.map((category) => ({
          url: `${baseUrl}/?cat=${category.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        })) || [];
    }

    return [...staticUrls, ...postUrls, ...categoryUrls];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticUrls;
  }
}
