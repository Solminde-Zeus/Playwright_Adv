import { Page, expect } from "@playwright/test";
import { NetworkMockingData } from "../test-data/bookStore.data";
export class NetworkMockingPage {
  constructor(private readonly page: Page) {}
  private readonly bookTitleLinks  = () => this.page.locator(".action-buttons span");
  private readonly bookRows        = () => this.page.locator(".rt-tr-group");
  private readonly loadingOverlay  = () => this.page.locator(".loading-overlay, [class*='loading']");
  async goto(): Promise<void> {
    await this.page.goto(NetworkMockingData.url);
  }
  // TC_NM_001 — Verify both mocked book titles are visible in the UI
  async verifyMockedBooksAreVisible(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await expect(this.bookTitleLinks()).toHaveCount(
      NetworkMockingData.mockedBooks.books.length
    );
    await expect(this.bookTitleLinks().nth(0)).toHaveText(
      NetworkMockingData.mockedBooks.books[0].title
    );
    await expect(this.bookTitleLinks().nth(1)).toHaveText(
      NetworkMockingData.mockedBooks.books[1].title
    );
  }
  // TC_NM_002 — Verify empty mock response renders no book titles
  async verifyEmptyStateIsVisible(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await expect(this.bookTitleLinks()).toHaveCount(0);
    // await expect(this.bookRows()).toBeVisible();
  }
  // TC_NM_003 — Verify loading state appears during delay then books render
  async verifyLoadingStateThenBooks(): Promise<void> {
    // The page is navigated by the fixture AFTER the route is set.
    // At this point the API is still pending (delayed), so we check
    // that the table has no titles yet — loading is in progress.
    const countDuringDelay = await this.bookTitleLinks().count();
    expect(countDuringDelay).toBe(0);
    // Now wait for the delayed API to resolve and the UI to settle
    await this.page.waitForLoadState("networkidle");
    // After the delay the mocked book must be visible
    await expect(this.bookTitleLinks().first()).toHaveText(
      NetworkMockingData.delayedBooks.books[0].title
    );
  }
}