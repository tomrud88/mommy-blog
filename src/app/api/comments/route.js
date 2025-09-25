import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/utils/auth";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const postSlug = searchParams.get("postSlug");

  try {
    const comments = await prisma.comment.findMany({
      where: {
        ...(postSlug && { postSlug }),
      },
    });

    return new NextResponse(JSON.stringify(comments, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

export const POST = async (req) => {
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

    return new NextResponse(JSON.stringify(comment, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};
