import { test as base } from "@playwright/test";
import { NetworkMockingPage } from "../pages/bookStorePage";
import { NetworkMockingData } from "../test-data/bookStore.data";
type NetworkMockingFixtures = {
  mockedBooksPage: NetworkMockingPage;
  emptyBooksPage: NetworkMockingPage;
  delayedBooksPage: NetworkMockingPage;
};
export const test = base.extend<NetworkMockingFixtures>({
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
    await page.goto(NetworkMockingData.url);
    await use(networkMockingPage);
  },
});
export { expect } from "@playwright/test";
