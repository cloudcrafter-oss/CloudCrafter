import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: './src/tests',
	/* Maximum time one test can run for. */
	timeout: 30 * 1000,
	expect: {
		/**
		 * Maximum time expect() should wait for the condition to be met.
		 * For example in `await expect(locator).toHaveText();`
		 */
		timeout: 5000,
	},
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [['list'], ['html']],
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: process.env.E2E_BASE_URL || 'http://frontend-7f000001.nip.io:3001',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',

		/* Capture screenshot on failure */
		screenshot: 'only-on-failure',
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},

		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},

		/* Test against mobile viewports, not for now. */
		// {
		// 	name: 'Mobile Chrome',
		// 	use: { ...devices['Pixel 5'] },
		// },
		// {
		// 	name: 'Mobile Safari',
		// 	use: { ...devices['iPhone 12'] },
		// },
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		// This should point to the web app's dev command
		command: 'cd ../../apps/web && bun run start',
		url: 'http://localhost:3001',
		reuseExistingServer: !process.env.CI,
		stdout: 'ignore',
		stderr: 'ignore',
	},
})
