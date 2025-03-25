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

	// test('should show both authentication options when available', async ({ page }) => {
	// 	// Navigate to login page
	// 	await page.goto('/auth/signin')

	// 	// Check for Credentials provider
	// 	await expect(page.getByLabel('Email')).toBeVisible()
	// 	await expect(page.getByLabel('Password')).toBeVisible()

	// 	// Check for Auth0 provider if it's enabled
	// 	// Note: This test may need to be conditional based on environment
	// 	const auth0Button = page.getByRole('button', { name: /Sign in with Auth0/i })
	// 	const auth0Enabled = await auth0Button.count() > 0

	// 	if (auth0Enabled) {
	// 		await expect(auth0Button).toBeVisible()
	// 	}
	// })

	// test('should login successfully with valid credentials', async ({ page }) => {
	// 	// Navigate to login page
	// 	await page.goto('/auth/signin')

	// 	// Fill in login form
	// 	await page.getByLabel('Email').fill('test@example.com')
	// 	await page.getByLabel('Password').fill('password123')

	// 	// Click login button
	// 	await page.getByRole('button', { name: 'Sign in with Credentials' }).click()

	// 	// Should redirect to dashboard after successful login
	// 	await expect(page).toHaveURL('/admin')
	// })

	// test('should show error with invalid credentials', async ({ page }) => {
	// 	// Navigate to login page
	// 	await page.goto('/auth/signin')

	// 	// Fill in login form with invalid credentials
	// 	await page.getByLabel('Email').fill('wrong@example.com')
	// 	await page.getByLabel('Password').fill('wrongpassword')

	// 	// Click login button
	// 	await page.getByRole('button', { name: 'Sign in with Credentials' }).click()

	// 	// Should stay on login page and show error
	// 	await expect(page).toHaveURL(/.*\/auth\/signin.*/)
	// 	await expect(page.getByText(/Invalid credentials/i)).toBeVisible()
	// })
})
