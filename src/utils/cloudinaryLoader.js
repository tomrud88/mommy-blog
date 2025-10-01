/**
 * Custom Cloudinary loader for Next.js Image component
 * Automatically optimizes images with format, quality, and size transformations
 */

export default function cloudinaryLoader({ src, width, quality }) {
  // If it's not a Cloudinary URL, return as-is
  if (!src.includes("res.cloudinary.com")) {
    return src;
  }

  // Extract the parts from Cloudinary URL
  const parts = src.split("/");
  const uploadIndex = parts.findIndex((part) => part === "upload");

  if (uploadIndex === -1) {
    return src;
  }

  // Build optimization parameters
  const params = [];

  // Add width transformation
  if (width) {
    params.push(`w_${width}`);
  }

  // Add quality (default to 80 if not specified)
  const q = quality || 80;
  params.push(`q_${q}`);

  // Add auto format and quality
  params.push("f_auto");
  params.push("dpr_auto");

  // Add progressive loading for larger images
  if (width > 400) {
    params.push("fl_progressive");
  }

  // Reconstruct URL with optimizations
  const beforeUpload = parts.slice(0, uploadIndex + 1);
  const afterUpload = parts.slice(uploadIndex + 1);

  return [...beforeUpload, params.join(","), ...afterUpload].join("/");
}
