import type { Page } from '@playwright/test'

/**
 * Login helper function to authenticate in tests that require it
 * @param page - Playwright page object
 * @param email - User email
 * @param password - User password
 */
export async function login(
	page: Page,
	email: string,
	password: string,
): Promise<void> {
	// Navigate to login page
	await page.goto('/login')

	// Fill in login form
	await page.getByLabel('Email').fill(email)
	await page.getByLabel('Password').fill(password)

	// Click login button
	await page.getByRole('button', { name: 'Sign in' }).click()

	// Wait for navigation to complete
	await page.waitForURL('/dashboard')
}

/**
 * Helper function to check if an element exists on the page
 * @param page - Playwright page object
 * @param selector - CSS selector for the element
 */
export async function elementExists(
	page: Page,
	selector: string,
): Promise<boolean> {
	const count = await page.locator(selector).count()
	return count > 0
}

/**
 * Helper function to wait for network requests to complete
 * @param page - Playwright page object
 */
export async function waitForNetworkIdle(page: Page): Promise<void> {
	await page.waitForLoadState('networkidle')
}

/**
 * Helper function to take a screenshot
 * @param page - Playwright page object
 * @param name - Screenshot name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
	await page.screenshot({ path: `./screenshots/${name}.png`, fullPage: true })
}
