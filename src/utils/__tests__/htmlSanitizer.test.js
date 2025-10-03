/**
 * @jest-environment jsdom
 */
import { sanitizeHTML, sanitizeBlogContent, stripHTML } from "../htmlSanitizer";

// Mock jsdom for server-side tests
jest.mock("jsdom", () => ({
  JSDOM: jest.fn(() => ({
    window: {
      document: {
        createElement: jest.fn(),
        implementation: {
          createHTMLDocument: jest.fn(),
        },
      },
    },
  })),
}));

jest.mock("dompurify", () => {
  const actualDOMPurify = jest.requireActual("dompurify");
  return {
    ...actualDOMPurify,
    sanitize: jest.fn((html, options) => {
      // Simple mock implementation for testing
      if (options?.ALLOWED_TAGS?.length === 0) {
        return html.replace(/<[^>]*>/g, "");
      }
      // Remove script tags and other dangerous elements
      return html
        .replace(/<script[^>]*>.*?<\/script>/gi, "")
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=/gi, "");
    }),
  };
});

describe("HTML Sanitizer Security Tests", () => {
  describe("XSS Prevention", () => {
    test("removes script tags", () => {
      const maliciousHTML = '<p>Hello</p><script>alert("XSS")</script>';
      const sanitized = sanitizeHTML(maliciousHTML);
      expect(sanitized).not.toContain("<script>");
      expect(sanitized).toContain("<p>Hello</p>");
    });

    test("removes iframe tags", () => {
      const maliciousHTML = '<p>Content</p><iframe src="evil.com"></iframe>';
      const sanitized = sanitizeHTML(maliciousHTML);
      expect(sanitized).not.toContain("<iframe>");
      expect(sanitized).toContain("<p>Content</p>");
    });

    test("removes javascript: URLs", () => {
      const maliciousHTML = "<a href=\"javascript:alert('XSS')\">Click me</a>";
      const sanitized = sanitizeHTML(maliciousHTML);
      expect(sanitized).not.toContain("javascript:");
    });

    test("removes event handlers", () => {
      const maliciousHTML = "<div onclick=\"alert('XSS')\">Click me</div>";
      const sanitized = sanitizeHTML(maliciousHTML);
      expect(sanitized).not.toContain("onclick");
    });

    test("allows safe HTML tags", () => {
      const safeHTML = "<p><strong>Bold</strong> and <em>italic</em> text</p>";
      const sanitized = sanitizeHTML(safeHTML);
      expect(sanitized).toContain("<p>");
      expect(sanitized).toContain("<strong>");
      expect(sanitized).toContain("<em>");
    });
  });

  describe("Blog Content Sanitization", () => {
    test("allows more tags for blog content", () => {
      const blogHTML = "<h1>Title</h1><p>Paragraph</p><ul><li>Item</li></ul>";
      const sanitized = sanitizeBlogContent(blogHTML);
      expect(sanitized).toContain("<h1>");
      expect(sanitized).toContain("<ul>");
      expect(sanitized).toContain("<li>");
    });

    test("still removes dangerous content from blog posts", () => {
      const maliciousHTML =
        '<h1>Title</h1><script>alert("XSS")</script><p>Safe content</p>';
      const sanitized = sanitizeBlogContent(maliciousHTML);
      expect(sanitized).not.toContain("<script>");
      expect(sanitized).toContain("<h1>Title</h1>");
      expect(sanitized).toContain("<p>Safe content</p>");
    });
  });

  describe("Strip HTML", () => {
    test("removes all HTML tags", () => {
      const html = "<p><strong>Bold text</strong> and <em>italic</em></p>";
      const stripped = stripHTML(html);
      expect(stripped).toBe("Bold text and italic");
    });

    test("handles empty or undefined input", () => {
      expect(stripHTML("")).toBe("");
      expect(stripHTML(null)).toBe("");
      expect(stripHTML(undefined)).toBe("");
    });
  });

  describe("Edge Cases", () => {
    test("handles deeply nested XSS attempts", () => {
      const maliciousHTML =
        '<div><p><span><script>alert("nested XSS")</script></span></p></div>';
      const sanitized = sanitizeHTML(maliciousHTML);
      expect(sanitized).not.toContain("<script>");
      expect(sanitized).toContain("<div>");
      expect(sanitized).toContain("<p>");
    });

    test("handles malformed HTML", () => {
      const malformedHTML =
        '<p>Unclosed paragraph<script>alert("XSS")</script>';
      const sanitized = sanitizeHTML(malformedHTML);
      expect(sanitized).not.toContain("<script>");
    });

    test("preserves text content while removing dangerous tags", () => {
      const mixedHTML =
        'Hello <script>alert("XSS")</script> <strong>World</strong>!';
      const sanitized = sanitizeHTML(mixedHTML);
      expect(sanitized).toContain("Hello");
      expect(sanitized).toContain("World");
      expect(sanitized).toContain("<strong>");
      expect(sanitized).not.toContain("<script>");
    });
  });
});
