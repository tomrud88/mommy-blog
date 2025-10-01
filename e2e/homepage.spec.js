import { test, expect } from "@playwright/test";

test.describe("Mommy Blog Homepage", () => {
  test("homepage loads successfully", async ({ page }) => {
    // Start the dev server first
    await page.goto("/");

    // Check if the page loads
    await expect(page).toHaveTitle(/Mammy Blog/);

    // Check if main navigation exists
    await expect(page.locator("nav")).toBeVisible();

    // Check if logo or title is visible
    await expect(page.locator("text=/mama|blog/i").first()).toBeVisible();
  });

  test("homepage has basic structure", async ({ page }) => {
    await page.goto("/");

    // Wait for content to load
    await page.waitForLoadState("networkidle");

    // Check if main content area exists
    await expect(
      page.locator('main, [role="main"], .container').first()
    ).toBeVisible();

    // Check if footer exists
    await expect(page.locator("footer")).toBeVisible();
  });

  test("responsive design works on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Wait for content to load
    await page.waitForLoadState("networkidle");

    // Check if page is responsive
    await expect(page.locator("body")).toBeVisible();

    // Check if content fits mobile viewport
    const body = page.locator("body");
    await expect(body).toHaveCSS("overflow-x", "hidden");
  });
});
