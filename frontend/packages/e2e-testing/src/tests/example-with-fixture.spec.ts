import { expect } from '@playwright/test'
import { test } from '../fixtures/user-fixture'

test.describe('Example with authenticated user', () => {
	test('should access protected area with pre-authenticated user', async ({
		authenticatedUser,
	}) => {
		// Navigate directly to a protected page
		await authenticatedUser.page.goto('/admin')

		// We should already be logged in and have access
		await expect(authenticatedUser.page).toHaveURL('/admin')

		// Verify user email is displayed (this is from the auth.spec.ts example)
		const userEmail = authenticatedUser.page.getByTestId('user-email')
		await expect(userEmail).toHaveText(authenticatedUser.email)
	})

	test('should be able to access API resources', async ({
		authenticatedUser,
	}) => {
		// Example of making an authenticated API request
		const response = await authenticatedUser.request.get('/api/user/profile', {
			headers: authenticatedUser.createAuthHeaders(),
		})

		// Verify the request was successful
		expect(response.ok()).toBeTruthy()

		// You can also work with the response data
		const data = await response.json()
		expect(data).toBeDefined()
	})
})
