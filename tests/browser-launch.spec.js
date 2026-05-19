import { expect, test } from "@playwright/test";

test("launches Chromium and opens a data URL", async ({ page }) => {
  await page.goto("data:text/html,<title>Bun Playwright Repro</title><h1>ok</h1>");

  await expect(page).toHaveTitle("Bun Playwright Repro");
  await expect(page.getByRole("heading", { name: "ok" })).toBeVisible();
});