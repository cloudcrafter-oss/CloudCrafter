import NextAuth, {
	type AuthValidity,
	type DecodedJWT,
	type User,
	type UserObject,
} from 'next-auth'
import 'next-auth/jwt'
import { validateEnv } from '@/auth-utils/providers'
import { authJsRefreshAccessToken } from '@/auth-utils/utils'
import { postLoginUser } from '@cloudcrafter/api'
import { jwtDecode } from 'jwt-decode'
import type { JWT } from 'next-auth/jwt'
import type { Provider } from 'next-auth/providers'
import Auth0 from 'next-auth/providers/auth0'
import Credentials from 'next-auth/providers/credentials'

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
				} catch (error) {
					console.error('Error during credentials authorization:', error)
					return null
				}
			},
		}),
	)
}

// async function refreshAccessToken(token: JWT): Promise<JWT> {
// 	try {
// 		const response = await postRefreshTokens({
// 			refreshToken: token.refreshToken as string,
// 		});
// 		return {
// 			...token,
// 			accessToken: response.accessToken,
// 			accessTokenExpires: Date.now() + response.expiresIn * 1000,
// 			refreshToken: response.refreshToken, // This will be the new refresh token
// 		};
// 	} catch (error) {
// 		console.log("cannot refresh tokens!");
// 		return {
// 			error: "RefreshAccessTokenError",
// 		};
// 	}
// }

export const { handlers, signIn, signOut, auth } = NextAuth({
	theme: { logo: 'https://authjs.dev/img/logo-sm.png' },
	providers,
	basePath: '/auth',
	//debug: process.env.NODE_ENV !== 'production' ? true : false,
	callbacks: {
		async jwt({ token, user, account }) {
			if (account && user) {
				console.debug('initial signin')
				return { ...token, data: user }
			}

			// The current access token is still valid
			if (Date.now() < token.data.validity.valid_until * 1000) {
				console.debug('Access token is still valid')
				console.debug('token: ', token.data.tokens)
				return token
			}

			if (Date.now() < token.data.validity.refresh_until * 1000) {
				console.debug('Access token is being refreshed')
				return await authJsRefreshAccessToken(token)
			}

			console.debug('Both tokens have expired')

			return { ...token, error: 'RefreshTokenExpired' } as JWT
		},
		async session({ session, token }) {
			session.user = token.data.user
			session.validity = token.data.validity
			session.error = token.error
			session.accessToken = token.data.tokens.access as string
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
