import NextAuth from 'next-auth'
import 'next-auth/jwt'
import Auth0 from 'next-auth/providers/auth0'
import type { Provider } from 'next-auth/providers'
import { postCreateUser } from '@/src/core/generated'

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

            user.specialToken = result.token

            return true
        },
        
        jwt({ token, user }) {
            if (user) { // User is available during sign-in
                token.cloudCraftTest = user.specialToken
            }
            return token
        },
        session({ session, token }) {
            session.user.id = token.id as string
            session.cloudCraftSession = token.cloudCraftTest
            console.log('sessino called')
            return session
        },
        authorized: async ({ request, auth }) => {
            const { pathname } = request.nextUrl
            if (pathname === '/authjs/middleware-example') return !!auth
            return true
        },
    }
})

declare module 'next-auth' {
    interface Session {
        accessToken?: string
        cloudCraftSession?: string
    }

    interface User {
        specialToken: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string
        cloudCraftTest?: string
    }
}