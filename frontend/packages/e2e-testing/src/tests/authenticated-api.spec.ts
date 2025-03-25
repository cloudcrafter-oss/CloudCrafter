import { createAuthHeaders, expect, test } from '../fixtures/user-fixture'

test.describe('Authenticated API Calls', () => {
	// This test will automatically use the authUser fixture for authentication
	test('should access protected endpoint with authentication token', async ({
		authUser,
		page,
	}) => {
		// The authUser fixture provides the authenticated user with token
		const { token } = authUser

		// Create headers using the token
		const headers = createAuthHeaders(token)

		// Example of making an authenticated API call
		const response = await page.request.get('/api/stacks', {
			headers,
		})

		// Verify the API call was successful
		expect(response.status()).toBe(200)

		// Verify we got a valid response
		const data = await response.json()
		expect(Array.isArray(data)).toBeTruthy()
	})

	// Demonstration of using the login fixture directly
	test('should be able to login with custom credentials', async ({
		login,
		page,
	}) => {
		// Use the login fixture directly with custom credentials
		const customEmail = 'test@example.com'
		const customPassword = 'password123'

		// This will perform the login and return the token
		const token = await login(customEmail, customPassword)

		// Verify we received a valid token
		expect(token).toBeDefined()
		expect(token.accessToken).toBeDefined()
		expect(token.accessToken.length).toBeGreaterThan(0)

		// Use the token for an authenticated request
		const headers = createAuthHeaders(token)
		const response = await page.request.get('/api/user/profile', {
			headers,
		})

		// Verify the API call was successful
		expect(response.status()).toBe(200)
	})
})
