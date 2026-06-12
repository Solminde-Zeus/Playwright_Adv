export const NetworkMockingData = {
  url: "https://demoqa.com/books",
  booksApiUrl: "**/BookStore/v1/Books",
  mockedBooks: {
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
      {
        isbn: "9780987654321",
        title: "Mocked Book Two",
        subTitle: "Another fake subtitle",
        author: "Another Author",
        publish_date: "2023-06-01T00:00:00.000Z",
        publisher: "Mock Publisher",
        pages: 200,
        description: "Second mocked book for testing purposes.",
        website: "https://example.com",
      },
    ],
  },
  emptyBooks: {
    books: [],
  },
  delayedBooks: {
    books: [
      {
        isbn: "9781122334455",
        title: "Delayed Book One",
        subTitle: "Loaded after delay",
        author: "Delay Author",
        publish_date: "2023-09-01T00:00:00.000Z",
        publisher: "Delay Publisher",
        pages: 150,
        description: "This book appears after a delayed API response.",
        website: "https://example.com",
      },
    ],
  },
  apiDelayMs: 3000,
} as const;