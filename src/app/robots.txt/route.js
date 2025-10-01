import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://mommy-blog.vercel.app";

  const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /api/
Disallow: /write
Disallow: /login
Disallow: /register

# Allow important pages
Allow: /
Allow: /about
Allow: /posts/
Allow: /category/`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
