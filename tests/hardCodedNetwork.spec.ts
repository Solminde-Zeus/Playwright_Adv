import { test, expect } from "@playwright/test";
 
const BOOKS_API_URL = "**/BookStore/v1/Books"; //** means ingore whatever data is there on the webpage and concentrate on the data we want */
const APP_URL = "https://demoqa.com/books";
 
const MOCKED_BOOKS = {     // mocked book data is here given in a aaray
  books: [
    {
      isbn: "9781234567890",
      title: "Mocked Book One",
      subTitle: "A fake subtitle",
      author: "Test Author",
      publish_date: "2023-01-01T00:00:00.000Z",
      publisher: "Mock Publisher",
      pages: 100,
      description: "A mocked book for testing purposes.",
      website: "https://example.com",
    },
  ],
};
 
test.describe("Day 2 — Network Mocking: Book Store API", () => {
 
  test("TC_006 — Intercept Books API and verify UI renders real response", async ({ page }) => {
    let apiCalled = false; 
 
    await page.route(BOOKS_API_URL, (route) => {  //"Keep a sharp look out for any network requests matching our BOOKS_API_URL variable."
      apiCalled = true;
      route.continue();
    });
 
    await page.goto(APP_URL);
    await page.waitForLoadState("networkidle");
 
    expect(apiCalled).toBe(true);
    await expect(page.locator(".action-buttons span").first()).toBeVisible();
  });
 
  test("TC_007 — Mock Books API with custom data and verify UI reflects mock", async ({ page }) => {
    await page.route(BOOKS_API_URL, (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCKED_BOOKS),
      });
    });
 
    await page.goto(APP_URL);
    await page.waitForLoadState("networkidle");
 
    await expect(page.locator(".action-buttons span").first()).toHaveText(
      MOCKED_BOOKS.books[0].title
    );
  });
 
  test("TC_010 — Simulate 500 API error and verify page does not crash", async ({ page }) => {
    await page.route(BOOKS_API_URL, (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    });
 
    await page.goto(APP_URL);
    await page.waitForLoadState("networkidle");
 
    await expect(page).not.toHaveTitle("");
    expect(await page.locator(".action-buttons span").count()).toBe(0);
  });
});
 