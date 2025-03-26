import { test as base, expect } from '@playwright/test'
import type { APIRequestContext, BrowserContext, Page } from '@playwright/test'
export * from '@playwright/test'
/**
 * Credentials used for authentication in tests
 */
interface Credentials {
	email: string
	password: string
}

/**
 * User fixture with authentication capabilities
 */
export class UserFixture {
	readonly context: BrowserContext
	readonly page: Page
	readonly request: APIRequestContext
	readonly email: string
	readonly password: string
	authToken?: string

	constructor(
		context: BrowserContext,
		page: Page,
		request: APIRequestContext,
		credentials: Credentials = {
			email: process.env.TEST_USER_EMAIL || 'demo@cloudcrafter.app',
			password: process.env.TEST_USER_PASSWORD || 'P@ssw0rd!123',
		},
	) {
		this.context = context
		this.page = page
		this.request = request
		this.email = credentials.email
		this.password = credentials.password
	}

	/**
	 * Login via UI (credentials provider)
	 */
	async login(): Promise<void> {
		await this.page.goto('/api/auth/signin')
		await this.page.goto('/admin')
		await expect(this.page).toHaveURL(/.*\/auth\/signin\?callbackUrl=.*/)

		const emailField = this.page.getByRole('textbox', { name: 'Email' })
		const passwordField = this.page.getByRole('textbox', { name: 'Password' })

		await emailField.fill(this.email)
		await passwordField.fill(this.password)

		await this.page
			.getByRole('button', { name: 'Sign in with Credentials' })
			.click()

		// Wait for successful login
		await this.page.waitForURL('/admin')
	}

	/**
	 * Login via API (faster than UI login)
	 */
	async loginViaApi(): Promise<void> {
		const response = await this.request.post('/api/auth/callback/credentials', {
			data: {
				email: this.email,
				password: this.password,
				redirect: false,
				csrfToken: await this.getCsrfToken(),
			},
		})

		if (!response.ok()) {
			throw new Error(`Failed to login via API: ${response.statusText()}`)
		}

		const cookies = await response.json()

		// Set cookies from response
		if (cookies.data?.cookies) {
			for (const cookie of cookies.data.cookies) {
				await this.context.addCookies([cookie])
			}
		}

		// Store auth token if present
		this.authToken = cookies.data?.token
	}

	/**
	 * Get CSRF token for authentication requests
	 */
	async getCsrfToken(): Promise<string> {
		const response = await this.request.get('/api/auth/csrf')
		const data = await response.json()
		return data.csrfToken
	}

	/**
	 * Create authentication headers for API requests
	 */
	createAuthHeaders(): Record<string, string> {
		if (!this.authToken) {
			throw new Error(
				'No auth token available. You must call loginViaApi() first.',
			)
		}

		return {
			Authorization: `Bearer ${this.authToken}`,
			'Content-Type': 'application/json',
		}
	}

	/**
	 * Logout the current user
	 */
	async logout(): Promise<void> {
		await this.page.goto('/api/auth/signout')
		await this.page.getByRole('button', { name: 'Sign out' }).click()

		// Clear auth token
		this.authToken = undefined
	}
}

/**
 * Extend Playwright's test with a user fixture
 */
export const test = base.extend<{
	authenticatedUser: UserFixture
}>({
	authenticatedUser: async ({ browser, page, request }, use) => {
		// Create browser context with storage state isolation
		const context = await browser.newContext()

		// Create user fixture
		const user = new UserFixture(context, page, request)

		// Login via API
		await user.login()

		// Make fixture available for use in tests
		await use(user)
	},
})
