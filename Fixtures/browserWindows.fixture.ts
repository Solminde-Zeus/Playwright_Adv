import { test as base } from "@playwright/test";
import { BrowserWindowsPage } from "../pages/browserWindoePage";
type BrowserWindowsFixtures = {
  browserWindowsPage: BrowserWindowsPage;
};
export const test = base.extend<BrowserWindowsFixtures>({
  browserWindowsPage: async ({ page, context }, use) => {
    const browserWindowsPage = new BrowserWindowsPage(page, context);
    await browserWindowsPage.goto();
    await use(browserWindowsPage);
  },
});
export { expect } from "@playwright/test";
