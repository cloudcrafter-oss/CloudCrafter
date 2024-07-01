import React from 'react'
import { UserProvider } from '@auth0/nextjs-auth0/client'

export const CloudCraftProvider = ({ children }: { children: React.ReactNode }) => {
    return <>
        <UserProvider>
            {children}
        </UserProvider>
    </>
}