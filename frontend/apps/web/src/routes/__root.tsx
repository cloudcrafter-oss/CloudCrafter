import {createRootRoute, Outlet} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/router-devtools'
import React from "react";

export const Route = createRootRoute({
    component: () => (
        <RootDocument>
            <Outlet/>
            <TanStackRouterDevtools/>
        </RootDocument>
    ),
})

const RootDocument = ({children}: { children: React.ReactNode }) => {
    return <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
            {children}
        </div>
    </div>
}