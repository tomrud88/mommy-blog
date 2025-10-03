"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

/**
 * Custom hook for managing CSRF tokens in React components
 * Automatically fetches and refreshes CSRF tokens for authenticated users
 */
export function useCSRFToken() {
  const { data: session, status } = useSession();
  const [csrfToken, setCSRFToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch CSRF token from API
   */
  const fetchCSRFToken = useCallback(async () => {
    if (status !== "authenticated" || !session) {
      setCSRFToken(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/csrf-token", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: ${response.status}`);
      }

      const data = await response.json();
      setCSRFToken(data.csrfToken);

      // Set up automatic refresh before token expires
      const expiresIn = new Date(data.expires).getTime() - Date.now();
      const refreshTime = Math.max(expiresIn - 5 * 60 * 1000, 30 * 1000); // 5 min before expiry or 30s min

      setTimeout(() => {
        fetchCSRFToken();
      }, refreshTime);
    } catch (err) {
      console.error("Error fetching CSRF token:", err);
      setError(err.message);
      setCSRFToken(null);
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  // Fetch token when session changes
  useEffect(() => {
    fetchCSRFToken();
  }, [fetchCSRFToken]);

  /**
   * Get headers with CSRF token for API requests
   */
  const getCSRFHeaders = useCallback(() => {
    if (!csrfToken) return {};

    return {
      "X-CSRF-Token": csrfToken,
      "Content-Type": "application/json",
    };
  }, [csrfToken]);

  /**
   * Add CSRF token to form data
   */
  const addCSRFToFormData = useCallback(
    (formData) => {
      if (!csrfToken) return formData;

      const newFormData = new FormData();

      // Copy existing form data
      if (formData instanceof FormData) {
        for (const [key, value] of formData.entries()) {
          newFormData.append(key, value);
        }
      } else {
        // Handle object form data
        Object.entries(formData || {}).forEach(([key, value]) => {
          newFormData.append(key, value);
        });
      }

      // Add CSRF token
      newFormData.append("csrfToken", csrfToken);
      return newFormData;
    },
    [csrfToken]
  );

  /**
   * Add CSRF token to JSON data
   */
  const addCSRFToJSON = useCallback(
    (data) => {
      if (!csrfToken) return data;

      return {
        ...data,
        csrfToken,
      };
    },
    [csrfToken]
  );

  /**
   * Make protected API request with CSRF token
   */
  const protectedFetch = useCallback(
    async (url, options = {}) => {
      if (!csrfToken) {
        throw new Error("No CSRF token available. Please refresh the page.");
      }

      const defaultOptions = {
        credentials: "include",
        headers: getCSRFHeaders(),
      };

      // Merge options
      const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
        },
      };

      // Add CSRF token to body if it's JSON
      if (mergedOptions.body && typeof mergedOptions.body === "string") {
        try {
          const bodyData = JSON.parse(mergedOptions.body);
          mergedOptions.body = JSON.stringify(addCSRFToJSON(bodyData));
        } catch (e) {
          // Body is not JSON, leave as is
        }
      }

      return fetch(url, mergedOptions);
    },
    [csrfToken, getCSRFHeaders, addCSRFToJSON]
  );

  /**
   * Refresh CSRF token manually
   */
  const refreshToken = useCallback(() => {
    fetchCSRFToken();
  }, [fetchCSRFToken]);

  return {
    csrfToken,
    loading,
    error,
    getCSRFHeaders,
    addCSRFToFormData,
    addCSRFToJSON,
    protectedFetch,
    refreshToken,
    isReady: !!csrfToken && status === "authenticated",
  };
}

/**
 * Higher-order component to provide CSRF protection
 */
export function withCSRFProtection(WrappedComponent) {
  return function CSRFProtectedComponent(props) {
    const csrfData = useCSRFToken();

    return <WrappedComponent {...props} csrf={csrfData} />;
  };
}

/**
 * Component to render hidden CSRF token input
 */
export function CSRFTokenInput({ className = "" }) {
  const { csrfToken } = useCSRFToken();

  if (!csrfToken) return null;

  return (
    <input
      type="hidden"
      name="csrfToken"
      value={csrfToken}
      className={className}
    />
  );
}

/**
 * Hook for forms with CSRF protection
 */
export function useCSRFForm() {
  const {
    csrfToken,
    addCSRFToFormData,
    addCSRFToJSON,
    protectedFetch,
    isReady,
  } = useCSRFToken();

  const submitForm = useCallback(
    async (url, formData, options = {}) => {
      if (!isReady) {
        throw new Error("CSRF token not ready. Please wait.");
      }

      const csrfFormData = addCSRFToFormData(formData);

      return protectedFetch(url, {
        method: "POST",
        body: csrfFormData,
        ...options,
      });
    },
    [isReady, addCSRFToFormData, protectedFetch]
  );

  const submitJSON = useCallback(
    async (url, data, options = {}) => {
      if (!isReady) {
        throw new Error("CSRF token not ready. Please wait.");
      }

      const csrfData = addCSRFToJSON(data);

      return protectedFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(csrfData),
        ...options,
      });
    },
    [isReady, addCSRFToJSON, protectedFetch]
  );

  return {
    csrfToken,
    isReady,
    submitForm,
    submitJSON,
    protectedFetch,
  };
}
