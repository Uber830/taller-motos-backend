# Tests Directory Structure

This directory contains all the test files for the application.

## Structure

- `e2e/`: End-to-end tests using Supertest
- `unit/`: Unit tests for individual components
- `performance/`: Performance and load tests
- `setup.ts`: Global test setup file

## Running Tests

```bash
# Run all tests
bun test

# Run tests with coverage
bun test:coverage

# Run specific test file
bun test path/to/test.ts
```

## Writing Tests

### Unit Tests

Place unit tests in the `unit/` directory. Follow this naming convention:

- `*.test.ts` for test files
- Test files should be placed in the same directory structure as the source files they test

### E2E Tests

Place end-to-end tests in the `e2e/` directory. These tests should test the API endpoints and integration between components.

### Performance Tests

Place performance tests in the `performance/` directory. These tests should measure the performance of critical paths in the application.
