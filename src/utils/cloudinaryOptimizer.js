/**
 * Utility function to optimize Cloudinary image URLs
 * Adds compression, format optimization, and size constraints
 */

export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  const { width = 800, quality = 75, format = "auto", crop = "fill" } = options;

  try {
    // Split the URL to inject optimization parameters
    const parts = url.split("/");
    const uploadIndex = parts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) return url;

    // Create optimization string
    const optimizations = [
      `w_${width}`,
      `q_${quality}`,
      `f_${format}`,
      `c_${crop}`,
      "dpr_auto",
      "fl_progressive",
    ].join(",");

    // Reconstruct URL with optimizations
    const beforeUpload = parts.slice(0, uploadIndex + 1);
    const afterUpload = parts.slice(uploadIndex + 1);

    return [...beforeUpload, optimizations, ...afterUpload].join("/");
  } catch (error) {
    console.warn("Failed to optimize Cloudinary URL:", error);
    return url;
  }
};

/**
 * Get optimized image URL based on component type
 */
export const getOptimizedImageUrl = (url, type = "post") => {
  const configurations = {
    post: { width: 500, quality: 70 },
    hero: { width: 1200, quality: 85 },
    single: { width: 800, quality: 75 },
    thumbnail: { width: 300, quality: 65 },
  };

  return optimizeCloudinaryUrl(url, configurations[type]);
};
