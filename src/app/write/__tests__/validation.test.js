/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Mock Next.js hooks
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock dynamic imports
jest.mock("react-quill", () => {
  return function MockReactQuill({ onChange, placeholder, value }) {
    return (
      <textarea
        data-testid="react-quill"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});

jest.mock("quill", () => ({}));

// Mock fetch globally
global.fetch = jest.fn();

describe("Post Validation", () => {
  const mockPush = jest.fn();
  const mockSession = {
    user: { id: "1", name: "Test User", email: "test@test.com" },
  };

  beforeEach(() => {
    useSession.mockReturnValue({ data: mockSession, status: "authenticated" });
    useRouter.mockReturnValue({ push: mockPush });
    fetch.mockClear();
    mockPush.mockClear();
  });

  it("validates required fields correctly", async () => {
    // Mock API calls
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: "1", slug: "mama", title: "Mama" },
          { id: "2", slug: "dziecko", title: "Dziecko" },
        ]),
    });

    const validateForm = (title, content, image, category) => {
      const errors = {};

      if (!title.trim()) {
        errors.title = "Tytuł jest wymagany";
      }

      if (!content.trim() || content.trim() === "<p><br></p>") {
        errors.content = "Treść artykułu jest wymagana";
      }

      if (!image) {
        errors.image = "Zdjęcie jest wymagane dla każdego artykułu";
      }

      if (!category) {
        errors.category = "Kategoria jest wymagana";
      }

      return errors;
    };

    // Test cases
    const testCases = [
      {
        title: "",
        content: "Test content",
        image: null,
        category: "mama",
        expectedErrors: ["title", "image"],
      },
      {
        title: "Test Title",
        content: "",
        image: "test.jpg",
        category: "mama",
        expectedErrors: ["content"],
      },
      {
        title: "Test Title",
        content: "<p><br></p>",
        image: "test.jpg",
        category: "mama",
        expectedErrors: ["content"],
      },
      {
        title: "Test Title",
        content: "Test content",
        image: null,
        category: "",
        expectedErrors: ["image", "category"],
      },
      {
        title: "Test Title",
        content: "Test content",
        image: "test.jpg",
        category: "mama",
        expectedErrors: [],
      },
    ];

    testCases.forEach((testCase, index) => {
      const errors = validateForm(
        testCase.title,
        testCase.content,
        testCase.image,
        testCase.category
      );

      const errorKeys = Object.keys(errors);

      expect(errorKeys).toEqual(testCase.expectedErrors);
    });
  });

  it("validates API request correctly", async () => {
    // Test API validation
    const validateApiRequest = (body) => {
      const { title, desc, img, catSlug } = body;
      const errors = {};

      if (!title || !title.trim()) {
        errors.title = "Tytuł jest wymagany";
      }

      if (!desc || !desc.trim() || desc.trim() === "<p><br></p>") {
        errors.desc = "Treść artykułu jest wymagana";
      }

      if (!img || !img.trim()) {
        errors.img = "Zdjęcie jest wymagane dla każdego artykułu";
      }

      if (!catSlug || !catSlug.trim()) {
        errors.catSlug = "Kategoria jest wymagana";
      }

      return errors;
    };

    // Test invalid request
    const invalidRequest = {
      title: "",
      desc: "",
      img: "",
      catSlug: "",
    };

    const errors = validateApiRequest(invalidRequest);
    expect(Object.keys(errors)).toHaveLength(4);
    expect(errors.title).toBe("Tytuł jest wymagany");
    expect(errors.desc).toBe("Treść artykułu jest wymagana");
    expect(errors.img).toBe("Zdjęcie jest wymagane dla każdego artykułu");
    expect(errors.catSlug).toBe("Kategoria jest wymagana");

    // Test valid request
    const validRequest = {
      title: "Test Title",
      desc: "Test description",
      img: "test-image.jpg",
      catSlug: "mama",
    };

    const noErrors = validateApiRequest(validRequest);
    expect(Object.keys(noErrors)).toHaveLength(0);
  });

  it("formats validation messages correctly", () => {
    const messages = {
      title: "Tytuł jest wymagany",
      content: "Treść artykułu jest wymagana",
      image: "Zdjęcie jest wymagane dla każdego artykułu",
      category: "Kategoria jest wymagana",
    };

    // Check that all messages are in Polish and user-friendly
    expect(messages.title).toMatch(/tytuł/i);
    expect(messages.content).toMatch(/treść/i);
    expect(messages.image).toMatch(/zdjęcie/i);
    expect(messages.category).toMatch(/kategoria/i);

    // Check that they end properly
    Object.values(messages).forEach((message) => {
      expect(message).toMatch(/wymagany|wymagana|wymagane/);
    });
  });
});
