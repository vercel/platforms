import { test, expect } from "@playwright/test";

test("should navigate to the landing page", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("http://localhost:3000/");

  await expect(page.locator("h1")).toContainText("Crowdfund, run, and grow");
});

test("Should navigate to the vitalia subdomain page", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("http://vitalia.localhost:3000/");

  await expect(page.getByText("Vitalia").first()).toBeVisible();
});
