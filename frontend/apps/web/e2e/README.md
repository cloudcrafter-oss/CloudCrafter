# CloudCrafter E2E Tests

This directory contains end-to-end tests for the CloudCrafter web application using Playwright.

## Setup

The tests are set up to run against the local development server. Make sure you have installed all dependencies:

```bash
pnpm install
```

## Running Tests

You can run the tests from the root of the project using the following commands:

### Run all tests

```bash
pnpm test:e2e
```

### Run tests with UI mode

```bash
pnpm test:e2e:ui
```

### Debug tests

```bash
pnpm test:e2e:debug
```

### View test report

```bash
pnpm test:e2e:report
```

Alternatively, you can run the tests directly from the web app directory:

```bash
cd frontend/apps/web
npx playwright test
```

## Test Structure

- `home.spec.ts` - Tests for the home page
- `auth.spec.ts` - Tests for authentication flows
- `log-viewer.spec.ts` - Tests for the ChannelLogViewer component
- `utils/test-utils.ts` - Utility functions for tests

## Configuration

The Playwright configuration is in `playwright.config.ts` in the root of the web app directory. It includes:

- Browser configurations (Chromium, Firefox, WebKit)
- Mobile device configurations
- Screenshot and trace settings
- Web server configuration

## CI Integration

Tests are automatically run in GitHub Actions on push to main/master and on pull requests. The workflow is defined in `.github/workflows/playwright.yml`.

## Adding New Tests

To add new tests:

1. Create a new file in the `e2e` directory with the `.spec.ts` extension
2. Import the necessary Playwright utilities:
   ```typescript
   import { test, expect } from '@playwright/test';
   ```
3. Write your tests using the Playwright API
4. Use the utility functions in `utils/test-utils.ts` for common operations
