import NextAuth from 'next-auth'
import 'next-auth/jwt'
import Auth0 from 'next-auth/providers/auth0'
import type { Provider } from 'next-auth/providers'
import { postCreateUser, postRefreshTokens } from '@/src/core/generated'
import { debugToken, isTokenExpired } from '@/src/utils/auth/jwt-utils.ts'
import { JWT } from 'next-auth/jwt'

const providers: Provider[] = [
    Auth0
]

export const providerMap = providers.map((provider) => {
    if (typeof provider === 'function') {
        const providerData = provider()
        return { id: providerData.id, name: providerData.name }
    } else {
        return { id: provider.id, name: provider.name }
    }
})

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        // Make a request to your backend to refresh the token
        const response = await postRefreshTokens({
            refreshToken: token.refreshToken as string
        })

        return {
            ...token,
            accessToken: response.accessToken,
            accessTokenExpires: Date.now() + response.expiresIn * 1000,
            refreshToken: response.refreshToken ?? token.refreshToken,
        }
    } catch (error) {
        console.error('Error refreshing access token', error)
        return {
            ...token,
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
        async signIn({ user, account, profile, email, credentials }) {
            console.log('signIn', user, account, profile, email, credentials)

            if (user) {
                const result = await postCreateUser({
                    name: user.name || '',
                    email: user.email || '',
                })

                user.userCloudCraftAccessToken = result.accessToken
                user.userCloudCraftRefreshToken = result.refreshToken
                user.userCloudCraftAccessTokenExpires = result.expiresIn
                // user.userCloudCraftRefreshToken = result.refreshToken

                return true
            }

            return false
        },

        async jwt({ token, user, account, session }) {
            if (user) { // User is available during sign-in
                return {
                    user,
                    accessToken: user.userCloudCraftAccessToken,
                    accessTokenExpires: user.userCloudCraftAccessTokenExpires,
                    refreshToken: user.userCloudCraftRefreshToken,
                }
            }

            if (token.jwtCloudCraftAccessToken) {
                debugToken(token.jwtCloudCraftAccessToken, 'jwt')
            } else {
                console.log('NO TOKEN!!!')
            }

            if (token.jwtCloudCraftAccessToken && !isTokenExpired(token.jwtCloudCraftAccessToken)) {
                return token
            }


            if (token.jwtCloudCraftRefreshToken) {
                console.log('refreshing')
                return refreshAccessToken(token)
            }

            return token
        },
        async session({ session, token, user, }) {

            debugToken(token.jwtCloudCraftAccessToken!, 'session')

            session.sessionCloudCraftAccessToken = token.jwtCloudCraftAccessToken
            session.sessionCloudCraftRefreshToken = token.jwtCloudCraftRefreshToken


            return session
        },
        authorized: async ({ request, auth }) => {
            const { pathname } = request.nextUrl
            if (pathname === '/authjs/middleware-example') return !!auth

            // check if pathname starts with /admin
            if (pathname.startsWith('/admin')) {
                return !!auth
            }

            return true
        },
    }
})

declare module 'next-auth' {
    interface Session {
        accessToken?: string
        sessionCloudCraftAccessToken?: string
        sessionCloudCraftRefreshToken?: string
    }

    interface User {
        userCloudCraftAccessToken?: string;
        userCloudCraftRefreshToken?: string;
        userCloudCraftAccessTokenExpires?: number
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string
        jwtCloudCraftAccessToken?: string
        jwtCloudCraftRefreshToken?: string
    }
}