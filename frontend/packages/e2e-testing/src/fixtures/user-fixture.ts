import { postLoginUser } from '@cloudcrafter/api/src/__generated__/axios-backend'
import type { TokenDto } from '@cloudcrafter/api/src/__generated__/types'
import { test as base } from '@playwright/test'

// Define our test fixture type with authentication
type UserFixture = {
	/**
	 * Authenticated user information including tokens
	 */
	authUser: {
		email: string
		token: TokenDto
	}
	/**
	 * Login with the specified credentials
	 */
	login: (email: string, password: string) => Promise<TokenDto>
}

/**
 * Extend the base test with our custom user fixture
 */
export const test = base.extend<UserFixture>({
	// Define the authUser fixture
	authUser: async ({ login }, use) => {
		// Default test credentials (as per memory about authentication system)
		const email = process.env.TEST_USER_EMAIL || 'demo@cloudcrafter.app'
		const password = process.env.TEST_USER_PASSWORD || 'P@ssw0rd!123'

		// Login and get token
		const token = await login(email, password)

		// Provide the authenticated user to the test
		await use({ email, token })
	},

	// Define the login fixture
	login: async (_, use) => {
		// Create a login function that can be used in tests
		const loginFn = async (
			email: string,
			password: string,
		): Promise<TokenDto> => {
			try {
				// Call the API login function from the generated client
				const tokenData = await postLoginUser({ email, password })
				return tokenData
			} catch (error) {
				console.error('Login failed:', error)
				throw new Error(`Authentication failed for user ${email}`)
			}
		}

		// Provide the login function to the test
		await use(loginFn)
	},
})

/**
 * Re-export expect from the base test
 */
export const { expect } = test

/**
 * Helper function to create auth headers from token
 */
export function createAuthHeaders(token: TokenDto): Record<string, string> {
	return {
		Authorization: `Bearer ${token.accessToken}`,
	}
}
