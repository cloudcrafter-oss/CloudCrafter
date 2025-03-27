import { expect } from '@playwright/test'
import type { APIRequestContext, Page } from '@playwright/test'
import { postLoginUser } from '../__generated__'
import { env } from '../infra/test-env'
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
	readonly page: Page
	readonly request: APIRequestContext
	readonly email: string
	readonly password: string
	authToken?: string

	constructor(
		page: Page,
		request: APIRequestContext,
		credentials: Credentials = {
			email: env.TEST_USER_EMAIL,
			password: env.TEST_USER_PASSWORD,
		},
	) {
		this.page = page
		this.request = request
		this.email = credentials.email
		this.password = credentials.password
	}

	/**
	 * Login via UI (credentials provider)
	 */
	async login(): Promise<void> {
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

	getBaseUrl(): string {
		return env.BACKEND_URI
	}

	/**
	 * Get API client configuration with baseURL and authorization headers
	 * @returns Configuration object with baseURL and headers
	 */
	getApiClientConfig() {
		return {
			baseURL: this.getBaseUrl(),
			headers: {
				Authorization: `Bearer ${this.authToken}`,
			},
		}
	}

	/**
	 * Login via API (faster than UI login)
	 */
	async loginViaApi(): Promise<void> {
		const apiUrl = this.getBaseUrl()
		const response = await postLoginUser(
			{
				email: this.email,
				password: this.password,
			},
			{
				baseURL: apiUrl,
			},
		)

		// Store auth token if present
		this.authToken = response.accessToken
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

	// Custom creators
}

// /**
//  * Extend Playwright's test with a user fixture
//  */
// export const test = base.extend<{
// 	authenticatedUser: UserFixture
// }>({
// 	authenticatedUser: async ({ browser, page, request }, use) => {
// 		// Create browser context with storage state isolation
// 		const context = await browser.newContext()

// 		// Create user fixture
// 		const user = new UserFixture(context, page, request)

// 		// Login via API
// 		await user.login()
// 		await user.loginViaApi()

// 		// Make fixture available for use in tests
// 		await use(user)
// 	},
// })
