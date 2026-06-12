import { test as base } from "@playwright/test";
import { NetworkMockingPage } from "../pages/bookStorePage";
import { NetworkMockingData } from "../test-data/bookStore.data";
type NetworkMockingFixtures = {
  mockedBooksPage: NetworkMockingPage;
  emptyBooksPage: NetworkMockingPage;
  delayedBooksPage: NetworkMockingPage;
};
export const test = base.extend<NetworkMockingFixtures>({
  // TC_NM_001 — Intercepts API and returns two mocked books
  mockedBooksPage: async ({ page }, use) => {
    await page.route(NetworkMockingData.booksApiUrl, (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(NetworkMockingData.mockedBooks),
      });
    });
    const networkMockingPage = new NetworkMockingPage(page);
    await networkMockingPage.goto();
    await use(networkMockingPage);
  },
  // TC_NM_002 — Intercepts API and returns empty books array
  emptyBooksPage: async ({ page }, use) => {
    await page.route(NetworkMockingData.booksApiUrl, (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(NetworkMockingData.emptyBooks),
      });
    });
    const networkMockingPage = new NetworkMockingPage(page);
    await networkMockingPage.goto();
    await use(networkMockingPage);
  },
  // TC_NM_003 — Intercepts API, waits 3 seconds, then returns delayed books
  delayedBooksPage: async ({ page }, use) => {
    await page.route(NetworkMockingData.booksApiUrl, async (route) => {
      await new Promise((resolve) =>
        setTimeout(resolve, NetworkMockingData.apiDelayMs)
      );
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(NetworkMockingData.delayedBooks),
      });
    });
    const networkMockingPage = new NetworkMockingPage(page);
    // Navigate but do NOT wait for networkidle here —
    // we hand control to the test while the API is still pending
    // so the spec can assert the loading/empty state before resolution.
    await page.goto(NetworkMockingData.url);
    await use(networkMockingPage);
  },
});
export { expect } from "@playwright/test";
