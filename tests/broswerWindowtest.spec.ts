import { test } from "../fixtures/browserWindows.fixture";

test.describe("Day 1 — Browser Windows: Multiple Tabs & Windows", () => {
  test("TC_001 — New Tab button opens a new browser tab", async ({
    browserWindowsPage,
  }) => {
    await browserWindowsPage.openNewTabAndVerifyItExists();
  });
  test("TC_002 — Newly opened tab contains expected sample page content", async ({
    browserWindowsPage,
  }) => {
    await browserWindowsPage.openNewTabAndVerifyItExists();
    await browserWindowsPage.verifyNewTabContent();
  });

  test("TC_003 — Closing child tab returns focus to the parent tab", async ({
    browserWindowsPage,
  }) => {
    await browserWindowsPage.openNewTabAndVerifyItExists();
    await browserWindowsPage.closeChildTabAndReturnToParent();
  });

  test("TC_004 — New Window Message button opens a window with correct message", async ({
    browserWindowsPage,
  }) => {
    await browserWindowsPage.verifyNewWindowMessageContent();
  });
});
