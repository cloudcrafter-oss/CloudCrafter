import fs from 'node:fs'
import path from 'node:path'
import { expect } from '@playwright/test'
import { test as baseTest } from '../fixtures/base-fixture'
import { env } from '../infra/test-env'
export * from '@playwright/test'

// biome-ignore lint/complexity/noBannedTypes: blame playwright: https://playwright.dev/docs/auth
export const test = baseTest.extend<{}, { workerStorageState: string }>({
	// Use the same storage state for all tests in this worker.
	storageState: ({ workerStorageState }, use) => use(workerStorageState),

	// Authenticate once per worker with a worker-scoped fixture.
	workerStorageState: [
		async ({ browser }, use) => {
			// Use parallelIndex as a unique identifier for each worker.
			const id = test.info().parallelIndex
			const fileName = path.resolve(
				test.info().project.outputDir,
				`.auth/${id}.json`,
			)

			if (fs.existsSync(fileName)) {
				// Reuse existing authentication state if any.
				await use(fileName)
				return
			}

			// Get baseURL from the Playwright configuration
			const baseUrl = test.info().project.use.baseURL

			if (!baseUrl) {
				throw new Error(
					'Base URL is not defined in the Playwright configuration',
				)
			}

			// Important: make sure we authenticate in a clean environment by unsetting storage state.
			const page = await browser.newPage({
				storageState: undefined,
				baseURL: baseUrl,
			})

			await page.goto('/admin')
			await expect(page).toHaveURL(/.*\/auth\/signin\?callbackUrl=.*/)

			const emailField = page.getByRole('textbox', { name: 'Email' })
			const passwordField = page.getByRole('textbox', { name: 'Password' })

			await emailField.fill(env.TEST_USER_EMAIL)
			await passwordField.fill(env.TEST_USER_PASSWORD)

			await page
				.getByRole('button', { name: 'Sign in with Credentials' })
				.click()

			// Wait for successful login
			await page.waitForURL('/admin')

			// End of authentication steps.

			await page.context().storageState({ path: fileName })
			await page.close()
			await use(fileName)
		},
		{ scope: 'worker' },
	],
})
