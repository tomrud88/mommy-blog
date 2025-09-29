/**
 * Get the correct base URL for API calls
 * This function will determine the correct URL based on the environment
 */
export const getBaseUrl = () => {
  // In production, use the NEXTAUTH_URL
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXTAUTH_URL || "http://localhost:3000";
  }

  // In development, try to determine the current port
  if (typeof window !== "undefined") {
    // Client-side: use the current window location
    return window.location.origin;
  }

  // Server-side: use the NEXTAUTH_URL or fallback to common ports
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // Fallback: try to determine from common development ports
  const availablePorts = process.env.AVAILABLE_PORTS?.split(",") || [
    "3000",
    "3001",
    "3002",
    "3003",
    "3004",
  ];

  // For server-side rendering, we'll use the first available port as fallback
  // In practice, NEXTAUTH_URL should be set correctly by the server startup
  return `http://localhost:${availablePorts[0]}`;
};

/**
 * Get the API base URL specifically for fetch requests
 */
export const getApiUrl = (endpoint) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/api${endpoint}`;
};
