import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { revalidatePath, revalidateTag } from "next/cache";

const triggerRevalidate = ({ slug, catSlug } = {}) => {
  revalidateTag("posts");
  revalidateTag("posts-all");
  if (slug) {
    revalidateTag(`post-${slug}`);
  }
  if (catSlug) {
    revalidateTag(`posts-${catSlug}`);
  }
  revalidatePath("/", "page");
  if (catSlug) {
    revalidatePath(`/?cat=${catSlug}`, "page");
  }
};

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page");
  const cat = searchParams.get("cat");

  const POST_PER_PAGE = 4;

  const query = {
    take: POST_PER_PAGE,
    skip: POST_PER_PAGE * (page - 1),
    where: {
      ...(cat && { catSlug: cat }),
    },
    orderBy: {
      createdAt: "desc",
    },
  };

  try {
    const [posts, count] = await prisma.$transaction([
      prisma.post.findMany(query),
      prisma.post.count({ where: query.where }),
    ]);

    return new NextResponse(JSON.stringify({ posts, count }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { title, desc, img, catSlug } = body;

    // Walidacja wymaganych pól
    const errors = {};

    if (!title || !title.trim()) {
      errors.title = "Tytuł jest wymagany";
    }

    if (!desc || !desc.trim() || desc.trim() === "<p><br></p>") {
      errors.desc = "Treść artykułu jest wymagana";
    }

    if (!img || !img.trim()) {
      errors.img = "Zdjęcie jest wymagane dla każdego artykułu";
    }

    if (!catSlug || !catSlug.trim()) {
      errors.catSlug = "Kategoria jest wymagana";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          message: "Błąd walidacji",
          errors,
        },
        { status: 400 }
      );
    }

    console.log("Creating post:", {
      title,
      desc,
      img,
      catSlug,
    });

    const post = await prisma.post.create({
      data: {
        title,
        desc,
        img,
        slug: slugify(title),
        cat: {
          connect: { slug: catSlug || "mama" },
        },
      },
    });

    // Revalidate cache to show new post immediately
    triggerRevalidate({ slug: post.slug, catSlug: post.catSlug });

    console.log("Post created:", post);
    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (err) {
    console.log("Error creating post:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  // Check if user is admin
  if (session.user.role !== "admin") {
    return new NextResponse(
      JSON.stringify({ message: "Tylko administrator może usuwać posty." }),
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { id, slug } = body;

    console.log("DELETE /api/posts body", { id, slug });

    if (!id && !slug) {
      return new NextResponse(
        JSON.stringify({ message: "Brak identyfikatora posta." }),
        { status: 400 }
      );
    }

    const post = await prisma.post.findFirst({
      where: {
        OR: [...(id ? [{ id }] : []), ...(slug ? [{ slug }] : [])],
      },
      select: { id: true, slug: true, catSlug: true },
    });

    console.log("DELETE /api/posts found", post);

    if (!post) {
      triggerRevalidate({ slug });
      return new NextResponse(
        JSON.stringify({
          message: "Post nie istnieje lub został już usunięty.",
        }),
        { status: 404 }
      );
    }

    await prisma.comment.deleteMany({ where: { postSlug: post.slug } });

    const deleteResult = await prisma.post.deleteMany({
      where: {
        OR: [{ id: post.id }, { slug: post.slug }],
      },
    });

    if (!deleteResult.count) {
      triggerRevalidate({ slug: post.slug, catSlug: post.catSlug });
      return new NextResponse(
        JSON.stringify({
          message: "Post nie istnieje lub został już usunięty.",
        }),
        { status: 404 }
      );
    }

    triggerRevalidate({ slug: post.slug, catSlug: post.catSlug });

    return new NextResponse(JSON.stringify({ message: "Post deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
