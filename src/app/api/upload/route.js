import { NextResponse } from "next/server";
import { applyRateLimit } from "@/utils/rateLimiter";

export async function POST(req) {
  // SECURITY: Apply strict rate limiting for uploads
  try {
    await applyRateLimit(req, "upload");
  } catch (error) {
    if (error.status === 429) {
      const response = NextResponse.json(
        {
          error: "Too Many Requests",
          message: "Zbyt wiele uploadów. Spróbuj ponownie za 5 minut.",
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
