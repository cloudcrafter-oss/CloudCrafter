import NextAuth, { type User } from 'next-auth'
import 'next-auth/jwt'
import { debugToken } from '@/src/utils/auth/jwt-utils'
import {
	postCreateUser,
	postLoginUser,
	postRefreshTokens,
} from '@cloudcrafter/api'
import type { JWT } from 'next-auth/jwt'
import type { Provider } from 'next-auth/providers'
import Auth0 from 'next-auth/providers/auth0'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

// Define schema for Auth0 environment variables
const auth0EnvSchema = z.object({
	AUTH_AUTH0_ID: z.string().min(1),
	AUTH_AUTH0_SECRET: z.string().min(1),
	AUTH_AUTH0_ISSUER: z.string().url(),
})

const credentialsEnvSchema = z.object({
	AUTH_CREDENTIALS_ENABLED: z.string().transform((val) => val === 'true'),
})

// Define schema for NextAuth environment variables
const nextAuthEnvSchema = z.object({
	NEXTAUTH_URL: z.string().url().optional(),
	NEXTAUTH_SECRET: z.string().min(1).optional(),
})

// Validate environment variables
const validateEnv = () => {
	// For Auth0 - this is optional, so we use safeParse
	const auth0Result = auth0EnvSchema.safeParse({
		AUTH_AUTH0_ID: process.env.AUTH_AUTH0_ID,
		AUTH_AUTH0_SECRET: process.env.AUTH_AUTH0_SECRET,
		AUTH_AUTH0_ISSUER: process.env.AUTH_AUTH0_ISSUER,
	})

	const credentialsResult = credentialsEnvSchema.safeParse({
		AUTH_CREDENTIALS_ENABLED: process.env.AUTH_CREDENTIALS_ENABLED,
	})

	// For NextAuth - this is required, so we use parse (will throw if invalid)
	try {
		nextAuthEnvSchema.parse({
			NEXTAUTH_URL: process.env.NEXTAUTH_URL,
			NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		})
	} catch (error) {
		console.error('NextAuth environment validation failed:', error)
		// In production, you might want to handle this differently
	}

	return {
		auth0Enabled: auth0Result.success,
		auth0Config: auth0Result.success ? auth0Result.data : null,
		credentialsEnabled: credentialsResult.success,

		credentialsConfig: credentialsResult.success
			? credentialsResult.data.AUTH_CREDENTIALS_ENABLED
			: null,
	}
}

// Initialize providers array
const providers: Provider[] = []

// Validate environment and conditionally add Auth0
const { auth0Enabled, auth0Config, credentialsEnabled, credentialsConfig } =
	validateEnv()

console.log({
	credentialsEnabled,
	credentialsConfig,
	test: process.env.AUTH_CREDENTIALS_ENABLED,
})

// Add Auth0 provider if environment variables are valid
if (auth0Enabled && auth0Config) {
	providers.push(
		Auth0({
			clientId: auth0Config.AUTH_AUTH0_ID,
			clientSecret: auth0Config.AUTH_AUTH0_SECRET,
			issuer: auth0Config.AUTH_AUTH0_ISSUER,
		}),
	)
}

// Add Credentials provider
if (credentialsEnabled && credentialsConfig) {
	providers.push(
		Credentials({
			name: 'Credentials',
			credentials: {
				email: {
					label: 'Email',
					type: 'email',
					placeholder: 'email@example.com',
				},
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, request) {
				if (!credentials?.email || !credentials?.password) {
					return null
				}

				try {
					// This is where you would typically validate credentials against your backend
					// For example:
					// const user = await validateCredentials(credentials.email, credentials.password)

					// For testing purposes, we'll use a simple check
					// In production, replace this with actual authentication logic

					const result = await postLoginUser({
						email: credentials.email,
						password: credentials.password,
					})

					// Transform TokenDto into User object
					return {
						id: credentials.email as string,
						email: credentials.email as string,
						name: credentials.email as string,
						userCloudCraftAccessToken: result.accessToken,
						userCloudCraftRefreshToken: result.refreshToken,
						userCloudCraftAccessTokenExpires:
							Date.now() + result.expiresIn * 1000,
						ssoType: 'email',
					}
				} catch (error) {
					console.error('Error during credentials authorization:', error)
					return null
				}
			},
		}),
	)
}

export const providerMap = providers.map((provider) => {
	if (typeof provider === 'function') {
		const providerData = provider()
		return { id: providerData.id, name: providerData.name }
	}
	return { id: provider.id, name: provider.name }
})

async function refreshAccessToken(token: JWT): Promise<JWT> {
	try {
		const response = await postRefreshTokens({
			refreshToken: token.refreshToken as string,
		})
		return {
			...token,
			accessToken: response.accessToken,
			accessTokenExpires: Date.now() + response.expiresIn * 1000,
			refreshToken: response.refreshToken, // This will be the new refresh token
		}
	} catch (error) {
		console.log('cannot refresh tokens!')
		return {
			error: 'RefreshAccessTokenError',
		}
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	theme: { logo: 'https://authjs.dev/img/logo-sm.png' },
	providers,
	basePath: '/auth',
	//debug: process.env.NODE_ENV !== 'production' ? true : false,
	callbacks: {
		async jwt({ token, user, account }) {
			if (account && user) {
				if (account.provider !== 'credentials') {
					const result = await postCreateUser({
						name: user.name || '',
						email: user.email || '',
					})

					return {
						accessToken: result.accessToken,
						accessTokenExpires: Date.now() + result.expiresIn * 1000,
						refreshToken: result.refreshToken,
						user,
					}
				}

				return {
					accessToken: user.userCloudCraftAccessToken,
					accessTokenExpires:
						Date.now() + (user.userCloudCraftAccessTokenExpires ?? 0) * 1000,
					refreshToken: user.userCloudCraftRefreshToken,
					user,
				}
			}

			if (user && (user as User).ssoType === 'email') {
				token.accessToken = user.userCloudCraftAccessToken
			}

			debugToken(token.accessToken as string, 'jwt')
			// Return previous token if the access token has not expired yet
			if (Date.now() < (token.accessTokenExpires as number)) {
				return token
			}

			// Access token has expired, try to update it
			return await refreshAccessToken(token)
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken as string
			session.error = token.error as string | undefined

			return session
		},
		authorized: async ({ request, auth }) => {
			const { pathname } = request.nextUrl
			if (pathname === '/authjs/middleware-example') return !!auth

			// check if pathname starts with /admin
			if (pathname.startsWith('/admin')) {
				return !!auth
			}

			if (pathname.startsWith('/api')) {
				return !!auth
			}

			return true
		},
	},
})

declare module 'next-auth' {
	interface Session {
		accessToken?: string
		sessionCloudCraftAccessToken?: string
		sessionCloudCraftRefreshToken?: string
		error?: string
	}

	interface User {
		userCloudCraftAccessToken?: string
		userCloudCraftRefreshToken?: string
		userCloudCraftAccessTokenExpires?: number
		ssoType: SsoType
	}
}

type SsoType = 'email' | other

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string
		jwtCloudCraftAccessToken?: string
		jwtCloudCraftRefreshToken?: string
	}
}
