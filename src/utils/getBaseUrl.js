/**
 * Get the correct base URL for API calls
 * This function will determine the correct URL based on the environment
 */
export const getBaseUrl = () => {
  // In production
  if (process.env.NODE_ENV === "production") {
    if (typeof window !== "undefined") {
      // Client-side: use the current window location
      return window.location.origin;
    }
    // Server-side: use NEXTAUTH_URL or VERCEL_URL
    return (
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_URL ||
      "https://mommy-blog-nlwrt969a-tomek198821wppls-projects.vercel.app"
    );
  }

  // In development, try to determine the current port
  if (typeof window !== "undefined") {
    // Client-side: use the current window location
    return window.location.origin;
  }

  // Server-side: for development, we need to use the same port the server is running on
  // Check if we're in Next.js development and try to get the actual port
  const port = process.env.PORT || process.env.NEXT_SERVER_PORT || "3000";

  // If NEXTAUTH_URL is set, use it (it should be updated by the dev server)
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // Fallback: use localhost with the port
  return `http://localhost:${port}`;
};

/**
 * Get the API base URL specifically for fetch requests
 */
export const getApiUrl = (endpoint) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/api${endpoint}`;
};
