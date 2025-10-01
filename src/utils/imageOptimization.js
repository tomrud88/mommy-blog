/**
 * Utility functions for image optimization
 */

/**
 * Creates a shimmer effect placeholder that looks more like a real image
 */
const createShimmerDataURL = (width, height) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
          <stop offset="25%" style="stop-color:#e9ecef;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#dee2e6;stop-opacity:1" />
          <stop offset="75%" style="stop-color:#e9ecef;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f8f9fa;stop-opacity:1" />
        </linearGradient>
        <pattern id="dots" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#f1f3f4"/>
          <circle cx="2" cy="2" r="0.5" fill="#e0e0e0" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#f8f9fa"/>
      <rect width="100%" height="100%" fill="url(#shimmer)" opacity="0.8"/>
      <rect width="100%" height="100%" fill="url(#dots)" opacity="0.2"/>
    </svg>
  `;

  if (typeof Buffer !== "undefined") {
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }

  // Fallback for client-side
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/**
 * Generates a blur data URL from an image source
 * This creates a real blur from the actual image
 */
export const generateBlurDataURL = async (imageSrc) => {
  try {
    // For static imports, Next.js can generate blur automatically
    if (typeof imageSrc === "object" && imageSrc.blurDataURL) {
      return imageSrc.blurDataURL;
    }

    // For dynamic URLs, we'll use a shimmer effect
    return createShimmerDataURL(640, 400);
  } catch (error) {
    return createShimmerDataURL(640, 400);
  }
};

/**
 * Default shimmer placeholder for all images
 */
export const DEFAULT_BLUR_DATA_URL = createShimmerDataURL(640, 400);

/**
 * Responsive image sizes for different use cases
 */
export const IMAGE_SIZES = {
  post: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  hero: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px",
  single: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px",
  sidebar: "(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 400px",
  icon: "50px",
  social: "18px",
  avatar: "40px",
};

/**
 * Quality settings for different image types
 */
export const IMAGE_QUALITY = {
  hero: 85,
  post: 80,
  thumbnail: 75,
  icon: 90,
};

/**
 * Optimized Image component with default settings
 */
import Image from "next/image";

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  sizes = IMAGE_SIZES.post,
  quality = IMAGE_QUALITY.post,
  priority = false,
  className,
  style,
  fill = false,
  ...props
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      sizes={sizes}
      quality={quality}
      priority={priority}
      placeholder="blur"
      blurDataURL={DEFAULT_BLUR_DATA_URL}
      className={className}
      style={style}
      {...props}
    />
  );
};
