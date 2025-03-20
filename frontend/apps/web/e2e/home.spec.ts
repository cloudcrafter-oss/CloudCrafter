import { expect, test } from '@playwright/test'

test.describe('Home Page', () => {
	test('should navigate to the home page', async ({ page }) => {
		// Navigate to the home page
		await page.goto('/')

		// Verify the page has loaded
		await expect(page).toHaveTitle(/CloudCrafter/)
	})

	test('should have navigation elements', async ({ page }) => {
		// Navigate to the home page
		await page.goto('/')

		// Check for navigation elements
		const navigation = page.getByRole('navigation')
		await expect(navigation).toBeVisible()
	})
})
