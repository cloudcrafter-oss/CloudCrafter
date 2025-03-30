# CloudCrafter E2E Testing

This package contains end-to-end tests for the CloudCrafter web application using Playwright.

## Features

- Authentication testing
- Home page navigation testing
- ChannelLogViewer component testing
- Shared test utilities for common operations

## Usage

### Running Tests

From the root of the monorepo:

```bash
# Run all tests
pnpm --filter @cloudcrafter/e2e-testing test

# Run tests with UI
pnpm --filter @cloudcrafter/e2e-testing test:ui

# Debug tests
pnpm --filter @cloudcrafter/e2e-testing test:debug

# View test reports
pnpm --filter @cloudcrafter/e2e-testing test:report
```

### Writing Tests

Tests are located in the `src/tests` directory. Utility functions are in `src/utils`.

When writing new tests, import utility functions from this package:

```typescript
import { login, elementExists, waitForNetworkIdle, takeScreenshot } from '@cloudcrafter/e2e-testing';
```

## Configuration

The Playwright configuration is in `playwright.config.ts`. Key settings:

- Base URL: `http://frontend-7f000001.nip.io:3001` (can be overridden with `E2E_BASE_URL` environment variable)
- Browsers: Chrome, Firefox, Safari, and mobile viewports
- Screenshots: Captured on test failure
- Traces: Collected on first retry

## Adding to package.json Scripts

Add these scripts to your root `package.json` for easier access:

```json
"scripts": {
  "test:e2e": "pnpm --filter @cloudcrafter/e2e-testing test",
  "test:e2e:ui": "pnpm --filter @cloudcrafter/e2e-testing test:ui",
  "test:e2e:debug": "pnpm --filter @cloudcrafter/e2e-testing test:debug",
  "test:e2e:report": "pnpm --filter @cloudcrafter/e2e-testing test:report"
}
```
