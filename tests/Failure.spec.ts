import { test, expect } from "@playwright/test";
import { NetworkMockingPage } from "../pages/bookStorePage"; // Path to your POM class

const APP_URL = "https://demoqa.com";
const BOOKS_API_URL = "**/BookStore/v1/Books";

test.describe("Day 2 Assignment — Intentional Failure Demonstrations", () => {
  
  // =========================================================================
  // SCENARIO A: Locator Not Found (Element Missing / Wrong ID)
  // =========================================================================
  test("Scenario A — Locator Not Found Timeout", async ({ page }) => {
    const bookStore = new NetworkMockingPage(page);
    await bookStore.goto();

    // Overriding the correct locator with a non-existent ID typo to simulate the failure
    // We add an explicit 2-second timeout so your test framework doesn't freeze for 30 seconds
    const brokenSearchInput = page.locator("#searchBox-wrong-id");
    
    // This will time out and crash because the element does not exist in the DOM
    await brokenSearchInput.fill("Git Pocket Guide", { timeout: 2000 });
  });

  // =========================================================================
  // SCENARIO B: Text / Assertion Mismatch
  // =========================================================================
  test("Scenario B — Text Assertion Mismatch", async ({ page }) => {
    const MOCKED_BOOKS = {
      books: [{ isbn: "123", title: "Mocked Book One", author: "Tester" }]
    };

    // Force mock the backend response with our specific mock data payload
    await page.route(BOOKS_API_URL, (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCKED_BOOKS),
      });
    });

    await page.goto(APP_URL);

    // Locate the first book cell link text content
    const firstBookLink = page.locator(".rt-tbody .rt-tr-group a").first();
    
    // Intentional Mismatch: UI shows "Mocked Book One", but we assert a completely different value
    await expect(firstBookLink).toHaveText("Expected A Different Title", { timeout: 2000 });
  });

  // =========================================================================
  // SCENARIO C: Strict Mode Violation (Multiple Elements Found)
  // =========================================================================
  test("Scenario C — Strict Mode Violation Click", async ({ page }) => {
    const bookStore = new NetworkMockingPage(page);
    await bookStore.goto();

    // Targeting multiple matching elements simultaneously without using .first() or .nth()
    const multiRowLocator = page.locator(".rt-tbody .rt-tr-group a");
    
    // Playwright strict mode will immediately reject this execution block
    await multiRowLocator.click();
  });

  // =========================================================================
  // SCENARIO D: Element Hidden / Covered (Not Actionable)
  // =========================================================================
  test("Scenario D — Element Actionability Check Blocked", async ({ page }) => {
    const bookStore = new NetworkMockingPage(page);
    await bookStore.goto();

    const targetSearch = page.locator("#searchBox");

    // Artificially modify the live DOM element properties via JS injection to hide it completely
    await targetSearch.evaluate((element) => {
      (element as HTMLElement).style.display = "none";
    });

    // Playwright locator will discover the item in HTML, but click actionability will fail completely
    await targetSearch.click({ timeout: 2000 });
  });

  // =========================================================================
  // SCENARIO E: API Network Failure (Unhandled 500 Server Error)
  // =========================================================================
  test("Scenario E — Unhandled 500 Server Error Cascade", async ({ page }) => {
    // Hijack network to inject a catastrophic 500 internal application backend failure state
    await page.route(BOOKS_API_URL, (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    });

    await page.goto(APP_URL);

    // This UI validation logic expects the normal successful books array table flow to load
    const firstBookLink = page.locator(".rt-tbody .rt-tr-group a").first();
    
    // The test crashes here because the grid rendered empty rows following the unhandled 500 error payload 
    await expect(firstBookLink).toBeVisible({ timeout: 2000 });
  });
});
