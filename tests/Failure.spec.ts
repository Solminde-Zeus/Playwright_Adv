import { test, expect } from "@playwright/test";
import { NetworkMockingPage } from "../pages/bookStorePage"; // Path to your POM class

const APP_URL = "https://demoqa.com";
const BOOKS_API_URL = "**/BookStore/v1/Books";

test.describe("Day 2 Assignment — Intentional Failure Demonstrations", () => {
  
  test("Scenario A — Locator Not Found Timeout", async ({ page }) => {
    const bookStore = new NetworkMockingPage(page);
    await bookStore.goto();

    const brokenSearchInput = page.locator("#searchBox-wrong-id");
    
    await brokenSearchInput.fill("Git Pocket Guide", { timeout: 2000 });
  });

  test("Scenario B — Text Assertion Mismatch", async ({ page }) => {
    const MOCKED_BOOKS = {
      books: [{ isbn: "123", title: "Mocked Book One", author: "Tester" }]
    };

    await page.route(BOOKS_API_URL, (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCKED_BOOKS),
      });
    });

    await page.goto(APP_URL);

    const firstBookLink = page.locator(".rt-tbody .rt-tr-group a").first();

    await expect(firstBookLink).toHaveText("Expected A Different Title", { timeout: 2000 });
  });

  test("Scenario C — Strict Mode Violation Click", async ({ page }) => {
    const bookStore = new NetworkMockingPage(page);
    await bookStore.goto();

    const multiRowLocator = page.locator(".rt-tbody .rt-tr-group a");
    
    await multiRowLocator.click();
  });

  test("Scenario D — Element Actionability Check Blocked", async ({ page }) => {
    const bookStore = new NetworkMockingPage(page);
    await bookStore.goto();

    const targetSearch = page.locator("#searchBox");

    await targetSearch.evaluate((element) => {
      (element as HTMLElement).style.display = "none";
    });

    await targetSearch.click({ timeout: 2000 });
  });

  test("Scenario E — Unhandled 500 Server Error Cascade", async ({ page }) => {
    await page.route(BOOKS_API_URL, (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    });

    await page.goto(APP_URL);

    const firstBookLink = page.locator(".rt-tbody .rt-tr-group a").first();
    
    await expect(firstBookLink).toBeVisible({ timeout: 2000 });
  });
});
