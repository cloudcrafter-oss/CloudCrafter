import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/src/auth.ts'
import { QueryProvider } from '@/src/app/providers/QueryProvider.tsx'


export const CloudCraftProvider = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth()


    return <>
        <SessionProvider basePath={'/auth'} session={session}>
            <QueryProvider>
                {children}
            </QueryProvider>
        </SessionProvider>
    </>
}