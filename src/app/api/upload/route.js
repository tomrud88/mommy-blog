import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "No file received." },
        { status: 400 }
      );
    }

    // Upload to Cloudinary (free tier available)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (result.secure_url) {
      return NextResponse.json(
        { message: "File uploaded successfully", url: result.secure_url },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to upload to Cloudinary" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: "Failed to upload file" },
      { status: 500 }
    );
  }
}
