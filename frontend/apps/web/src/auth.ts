import NextAuth, { User } from 'next-auth'
import 'next-auth/jwt'
import Auth0 from 'next-auth/providers/auth0'
import type { Provider } from 'next-auth/providers'
import { postCreateUser, postRefreshTokens } from '@/src/core/generated'
import { JWT } from 'next-auth/jwt'
import { debugToken } from '@/src/utils/auth/jwt-utils.ts'

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

        console.log('refreshAccessToken')
        const response = await postRefreshTokens({
            refreshToken: token.refreshToken as string,
        })

        console.log('refreshaccessTokenResponse', response)

        return {
            ...token,
            accessToken: response.accessToken,
            accessTokenExpires: Date.now() + response.expiresIn * 1000,
            refreshToken: response.refreshToken, // This will be the new refresh token
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

        async jwt({ token, user, account }) {
            if (account && user) {
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

            debugToken(token.accessToken!, 'jwt')
            // Return previous token if the access token has not expired yet
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token
            }

            // Access token has expired, try to update it
            return await refreshAccessToken(token)

        },
        async session({ session, token, user, }) {

            session.user = token.user as User
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