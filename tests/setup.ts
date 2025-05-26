// This file runs before each test file
// Add any global test setup here

import { beforeAll, afterAll } from "bun:test";

beforeAll(() => {
  // Setup any test environment variables
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret";
});

afterAll(() => {
  // Cleanup after all tests
});
