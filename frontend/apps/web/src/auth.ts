import NextAuth from 'next-auth'
import 'next-auth/jwt'
import Auth0 from 'next-auth/providers/auth0'
import type { Provider } from 'next-auth/providers'
import { postCreateUser, postRefreshTokens } from '@/src/core/generated'

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

export const { handlers, signIn, signOut, auth } = NextAuth({
    theme: { logo: 'https://authjs.dev/img/logo-sm.png' },
    providers,
    basePath: '/auth',
    //debug: process.env.NODE_ENV !== 'production' ? true : false,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log('signIn', user, account, profile, email, credentials)

            const result = await postCreateUser({
                name: user.name || '',
                email: user.email || '',
            })

            const refreshResult = await postRefreshTokens({ refreshToken: '' })


            user.userCloudCraftAccessToken = result.accessToken
            user.userCloudCraftRefreshToken = result.refreshToken

            return true
        },

        jwt({ token, user, account, session }) {


            if (user) { // User is available during sign-in
                token.jwtCloudCraftAccessToken = user.userCloudCraftAccessToken
                token.jwtCloudCraftRefreshToken = user.userCloudCraftRefreshToken
            }
            return token
        },
        session({ session, token, user, }) {

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
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string
        jwtCloudCraftAccessToken?: string
        jwtCloudCraftRefreshToken?: string
    }
}