/**
 * @jest-environment jsdom
 */
import {
  generateBlurDataURL,
  DEFAULT_BLUR_DATA_URL,
  IMAGE_SIZES,
  IMAGE_QUALITY,
} from "../imageOptimization";

describe("Image Optimization Utils", () => {
  it("exports default blur data URL", () => {
    expect(DEFAULT_BLUR_DATA_URL).toBeTruthy();
    expect(DEFAULT_BLUR_DATA_URL).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it("has correct image sizes for different use cases", () => {
    expect(IMAGE_SIZES.post).toBe(
      "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    );
    expect(IMAGE_SIZES.hero).toBe(
      "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px"
    );
    expect(IMAGE_SIZES.single).toBe(
      "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
    );
    expect(IMAGE_SIZES.icon).toBe("50px");
  });

  it("has correct quality settings", () => {
    expect(IMAGE_QUALITY.hero).toBe(85);
    expect(IMAGE_QUALITY.post).toBe(80);
    expect(IMAGE_QUALITY.thumbnail).toBe(75);
    expect(IMAGE_QUALITY.icon).toBe(90);
  });

  it("generates blur data URL on server side", async () => {
    // Test server-side fallback (Jest doesn't support canvas)
    const blurURL = await generateBlurDataURL();
    expect(blurURL).toBeTruthy();
    expect(blurURL).toMatch(/^data:image\/svg\+xml;base64,/);
    // Should return the fallback URL in test environment
    expect(blurURL).toBe(DEFAULT_BLUR_DATA_URL);
  });

  it("validates responsive sizes format", () => {
    // Check that sizes follow proper CSS media query format
    const sizes = Object.values(IMAGE_SIZES);
    sizes.forEach((size) => {
      expect(size).toBeTruthy();
      // Should either be a fixed size (like "50px") or contain viewport units
      expect(size).toMatch(/(px|vw)/);
    });
  });

  it("validates quality values are within valid range", () => {
    const qualities = Object.values(IMAGE_QUALITY);
    qualities.forEach((quality) => {
      expect(quality).toBeGreaterThan(0);
      expect(quality).toBeLessThanOrEqual(100);
    });
  });
});
