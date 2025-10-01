"use client";
import Image from "next/image";
import { useState } from "react";

// Simple function to optimize Cloudinary URLs
const optimizeImageUrl = (url) => {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  try {
    const parts = url.split("/");
    const uploadIndex = parts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) return url;

    const optimizations = "w_1000,q_75,f_auto,c_fill,dpr_auto,fl_progressive";
    const beforeUpload = parts.slice(0, uploadIndex + 1);
    const afterUpload = parts.slice(uploadIndex + 1);

    return [...beforeUpload, optimizations, ...afterUpload].join("/");
  } catch (error) {
    console.warn("Failed to optimize image URL:", error);
    return url;
  }
};

const HeroImage = ({
  src,
  alt,
  className,
  style,
  sizes,
  priority = false,
  quality = 75,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Image
      src={optimizeImageUrl(src)}
      alt={alt}
      fill
      className={className}
      data-loaded={imageLoaded}
      style={style}
      sizes={sizes}
      priority={priority}
      quality={quality}
      onLoad={() => setImageLoaded(true)}
    />
  );
};

export default HeroImage;
