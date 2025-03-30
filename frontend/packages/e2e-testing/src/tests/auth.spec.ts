import { expect, test } from '@playwright/test'

test.describe('Authentication', () => {
	test('should show login page when not authenticated', async ({ page }) => {
		// Navigate to a protected page
		await page.goto('/admin')

		// Should be redirected to login
		await expect(page).toHaveURL(/.*\/auth\/signin\?callbackUrl=.*/)
	})

	test('should be able to login with dummy demo credentials', async ({
		page,
	}) => {
		await page.goto('/admin')
		await expect(page).toHaveURL(/.*\/auth\/signin\?callbackUrl=.*/)

		const emailField = page.getByRole('textbox', { name: 'Email' })
		const passwordField = page.getByRole('textbox', { name: 'Password' })

		await emailField.fill('demo@cloudcrafter.app')
		await passwordField.fill('P@ssw0rd!123')

		await page.getByRole('button', { name: 'Sign in with Credentials' }).click()

		await expect(page).toHaveURL('/admin')

		const userEmail = page.getByTestId('user-email')
		await expect(userEmail).toHaveText('demo@cloudcrafter.app')
	})
})
