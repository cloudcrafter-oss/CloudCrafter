import NextAuth, {
	type AuthValidity,
	type DecodedJWT,
	type User,
	type UserObject,
} from 'next-auth'
import 'next-auth/jwt'

import { jwtDecode } from 'jwt-decode'
import type { JWT } from 'next-auth/jwt'
import type { Provider } from 'next-auth/providers'
import Auth0 from 'next-auth/providers/auth0'
import Credentials from 'next-auth/providers/credentials'
import { type TokenDto, postCreateUser, postLoginUser } from '../__generated__'
import { validateEnv } from '../auth-utils/providers'
import { authJsRefreshAccessToken } from '../auth-utils/utils'

// Initialize providers array
const providers: Provider[] = []

// Validate environment and conditionally add Auth0
const { auth0Enabled, auth0Config, credentialsEnabled, credentialsConfig } =
	validateEnv()

// console.log({
// 	credentialsEnabled,
// 	credentialsConfig,
// 	test: process.env.AUTH_CREDENTIALS_ENABLED,
// })

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

const createUserObject = (result: TokenDto): User => {
	const access: DecodedJWT = jwtDecode(result.accessToken)

	const user: UserObject = {
		name: access.name,
		email: access.email,
		id: access.id,
	}

	const date = new Date(result.refreshTokenExpires)

	// Get the epoch time in milliseconds and convert to seconds
	const epochSeconds = Math.floor(date.getTime() / 1000)

	const validity: AuthValidity = {
		valid_until: access.exp,
		refresh_until: epochSeconds,
	}

	return {
		id: access.jti, // User object is forced to have a string id so use refresh token id
		tokens: {
			access: result.accessToken,
			refresh: result.refreshToken,
		},
		user: user,
		validity: validity,
	} as User
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

					// This is where you would typically validate credentials against your backend
					// For example:
					// const user = await validateCredentials(credentials.email, credentials.password)

					// For testing purposes, we'll use a simple check
					// In production, replace this with actual authentication logic

					const result = await postLoginUser({
						email: credentials.email as string,
						password: credentials.password as string,
					})

					return createUserObject(result)
				} catch (error) {
					console.error('Error during credentials authorization:', error)
					return null
				}
			},
		}),
	)
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	theme: { logo: 'https://authjs.dev/img/logo-sm.png' },
	providers,
	debug: process.env.NODE_ENV !== 'production',
	callbacks: {
		async jwt({ token, user, account }) {
			if (account && user) {
				if (account.type === 'oidc') {
					const result = await postCreateUser({
						name: user.name || '',
						email: user.email || '',
					})

					const userObject = createUserObject(result)
					return { ...token, data: userObject }
				}

				//console.debug('initial signin')
				return { ...token, data: user }
			}

			// The current access token is still valid
			if (Date.now() < token.data.validity.valid_until * 1000) {
				//console.debug('Access token is still valid')
				//console.debug('token: ', token.data.tokens)
				return token
			}

			if (Date.now() < token.data.validity.refresh_until * 1000) {
				console.debug('Access token is being refreshed')
				return await authJsRefreshAccessToken(token)
			}

			//console.debug('Both tokens have expired')

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
			//console.error('auth is', auth)

			if (pathname === '/auth-debug') {
				console.error('auth is', auth)
				return !!auth
			}

			// check if pathname starts with /admin
			if (pathname.startsWith('/admin')) {
				//	console.log('auth is', auth)
				return !!auth
			}

			if (pathname.startsWith('/api')) {
				//console.log('auth is', auth)
				return !!auth
			}

			//console.log('auth is', auth)
			return true
		},
	},
})
