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
  async verifyEmptyStateIsVisible(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await expect(this.bookTitleLinks()).toHaveCount(0);
  }
  async verifyLoadingStateThenBooks(): Promise<void> {
    const countDuringDelay = await this.bookTitleLinks().count();
    expect(countDuringDelay).toBe(0);
    await this.page.waitForLoadState("networkidle");
    await expect(this.bookTitleLinks().first()).toHaveText(
      NetworkMockingData.delayedBooks.books[0].title
    );
  }
}