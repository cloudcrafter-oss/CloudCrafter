import { auth } from '@/src/auth.ts'
import { SessionProvider } from 'next-auth/react'
import ClientExample from '@/src/app/authjs/components/client-example.tsx'


export default async function ClientPage() {
    const session = await auth()
    console.log(session)
    // if (session?.user) {
    //     // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
    //     // filter out sensitive data before passing to client.
    //     session.user = {
    //         name: session.user.name,
    //         email: session.user.email,
    //         image: session.user.image,
    //     }
    // }

    return (
        <SessionProvider basePath={'/auth'} session={session}>
            <ClientExample/>
        </SessionProvider>
    )
}
