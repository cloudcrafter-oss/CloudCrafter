import 'next-auth/jwt'
import { getServerSession } from 'next-auth'

import type { JWT } from 'next-auth/jwt'
import type { Provider } from 'next-auth/providers'
import Auth0 from 'next-auth/providers/auth0'
import Credentials from 'next-auth/providers/credentials'
import { validateEnv } from '../auth-utils/providers'

import { loginWithOidc } from './actions/login-oidc'
import { loginWithPassword } from './actions/login-pwd'
import { authJsRefreshAccessToken } from './actions/refresh'

// Initialize providers array
const providers: Provider[] = []

// Validate environment and conditionally add Auth0
const { auth0Enabled, auth0Config, credentialsEnabled, credentialsConfig } =
	validateEnv()

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
				try {
					if (!credentials?.email || !credentials?.password) {
						return null
					}

					return await loginWithPassword(
						credentials.email as string,
						credentials.password as string,
					)
				} catch (error) {
					console.error('Error during credentials authorization:', error)
					return null
				}
			},
		}),
	)
}

export const authOptions = {
	theme: { logo: 'https://authjs.dev/img/logo-sm.png' },
	providers,
	callbacks: {
		async jwt({ token, user, account }) {
			if (account && user) {
				if (account.type === 'oidc') {
					const userObject = await loginWithOidc(
						user.name || '',
						user.email || '',
					)
					return { ...token, data: userObject }
				}
				return { ...token, data: user }
			}

			if (Date.now() < token.data.validity.valid_until * 1000) {
				return token
			}

			if (Date.now() < token.data.validity.refresh_until * 1000) {
				return await authJsRefreshAccessToken(token)
			}

			return { error: 'RefreshTokenExpired' } as JWT
		},
		async session({ session, token }) {
			session.user = {
				...token.data.user,
				emailVerified: null,
				tokens: token.data.tokens,
				user: token.data.user,
				validity: token.data.validity,
				id: '0',
			}
			session.validity = token.data.validity
			session.error = token.error
			session.tokens = token.data.tokens
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
}

export type TokenUser = {
	name?: string | null
	email?: string | null
	image?: string | null
	id: string
}

export async function getAuthSession() {
	return getServerSession(authOptions)
}

export async function initiateSignIn(provider?: string) {
	return {
		error: 'Method not implemented for server-side call',
	}
}

export async function initiateSignOut(
	options?: Parameters<typeof signOut>[0],
): Promise<{ url: string }> {
	return {
		url: '/',
	}
}
