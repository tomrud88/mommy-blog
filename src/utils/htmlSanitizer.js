/**
 * HTML Sanitization utility for XSS protection
 * Uses DOMPurify to clean potentially dangerous HTML content
 */

import DOMPurify from "dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - Raw HTML content
 * @param {Object} options - DOMPurify configuration options
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHTML = (html, options = {}) => {
  if (!html) return "";

  // Check if we're on the server side
  if (typeof window === "undefined") {
    // Server-side: Use jsdom for DOMPurify
    const createDOMPurify = require("dompurify");
    const { JSDOM } = require("jsdom");

    const window = new JSDOM("").window;
    const purify = createDOMPurify(window);

    return purify.sanitize(html, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "i",
        "b",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "blockquote",
        "a",
        "span",
        "div",
      ],
      ALLOWED_ATTR: ["href", "target", "rel"],
      ALLOW_DATA_ATTR: false,
      ...options,
    });
  }

  // Client-side: Use regular DOMPurify
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "i",
      "b",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "span",
      "div",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOW_DATA_ATTR: false,
    ...options,
  });
};

/**
 * Sanitize HTML for blog post content
 * More permissive than default sanitization
 * @param {string} html - Blog post HTML content
 * @returns {string} - Sanitized HTML
 */
export const sanitizeBlogContent = (html) => {
  return sanitizeHTML(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "i",
      "b",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "span",
      "div",
      "img", // Allow images in blog posts
    ],
    ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "src",
      "alt",
      "width",
      "height",
      "title",
    ],
    ALLOWED_URI_REGEXP: /^https?:\/\//i, // Only allow https/http URLs
  });
};

/**
 * Strip all HTML tags and return plain text
 * @param {string} html - HTML content
 * @returns {string} - Plain text
 */
export const stripHTML = (html) => {
  if (!html) return "";

  if (typeof window === "undefined") {
    // Server-side: Simple regex fallback
    return html.replace(/<[^>]*>/g, "").trim();
  }

  // Client-side: Use DOMPurify to strip all tags
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
};
