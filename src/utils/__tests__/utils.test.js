/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";

// Simple utility function test
describe("Utility Functions", () => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pl-PL");
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  it("formats date correctly", () => {
    const testDate = "2023-01-01T00:00:00.000Z";
    const formatted = formatDate(testDate);
    expect(formatted).toBe("1.01.2023");
  });

  it("truncates text correctly", () => {
    const longText = "This is a very long text that should be truncated";
    const truncated = truncateText(longText, 20);
    expect(truncated).toBe("This is a very long ...");
  });

  it("does not truncate short text", () => {
    const shortText = "Short text";
    const result = truncateText(shortText, 20);
    expect(result).toBe("Short text");
  });
});
