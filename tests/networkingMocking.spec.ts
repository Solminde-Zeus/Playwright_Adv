import { test } from "../Fixtures/bookStore.fixture";
test.describe("Network Mocking — Mock | Empty | Delay", () => {
  test("TC_NM_001 — Mocked books are visible in the UI", async ({ mockedBooksPage }) => {
    await mockedBooksPage.verifyMockedBooksAreVisible();
  });
  test("TC_NM_002 — Empty mock response shows empty state in the UI", async ({ emptyBooksPage }) => {
    await emptyBooksPage.verifyEmptyStateIsVisible();
  });
  test("TC_NM_003 — Delayed API response shows loading state then renders books", async ({ delayedBooksPage }) => {
    await delayedBooksPage.verifyLoadingStateThenBooks();
  });
});