/**
 * @jest-environment jsdom
 */
import { getBaseUrl, getApiUrl } from "../getBaseUrl";

// Mock the environment
const originalEnv = process.env;

describe("getBaseUrl", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    // Clear window location mock
    delete window.location;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns NEXTAUTH_URL in production", () => {
    process.env.NODE_ENV = "production";
    process.env.NEXTAUTH_URL = "https://example.com";

    const url = getBaseUrl();
    expect(url).toBe("https://example.com");
  });

  it("returns window.location.origin on client side", () => {
    process.env.NODE_ENV = "development";

    // Mock window.location
    window.location = {
      origin: "http://localhost:3002",
    };

    const url = getBaseUrl();
    expect(url).toBe("http://localhost:3002");
  });

  it("returns localhost with port on server side", () => {
    process.env.NODE_ENV = "development";
    process.env.PORT = "3001";

    // Mock window as undefined (server-side)
    const originalWindow = global.window;
    delete global.window;

    const url = getBaseUrl();
    expect(url).toBe("http://localhost:3001");

    // Restore window
    global.window = originalWindow;
  });

  it("getApiUrl creates correct API URL", () => {
    process.env.NODE_ENV = "production";
    process.env.NEXTAUTH_URL = "https://example.com";

    const apiUrl = getApiUrl("/posts");
    expect(apiUrl).toBe("https://example.com/api/posts");
  });
});
