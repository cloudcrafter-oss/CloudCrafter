import NextAuth from 'next-auth'
import Auth0 from 'next-auth/providers/auth0'


export const { handlers, signIn, signOut, auth } = NextAuth({
    theme: { logo: 'https://authjs.dev/img/logo-sm.png' },
    providers: [
        Auth0,
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log(user)
                // This is where you would make your API call
                // For example:
                // const response = await fetch('your-api-endpoint', {
                //   method: 'POST',
                //   body: JSON.stringify(user),
                //   headers: { 'Content-Type': 'application/json' },
                // })
                // const data = await response.json()
                // token.accessToken = data.accessToken
            }
            return token
        },
    }
})