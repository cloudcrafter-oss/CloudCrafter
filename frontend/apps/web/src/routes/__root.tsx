import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import React from "react";

export const Route = createRootRoute({
    component: () => (
        <RootDocument>
            <Outlet />
            <TanStackRouterDevtools />
        </RootDocument>
    ),
})

const RootDocument = ({children}:{children: React.ReactNode}) => {
    return <>
        {children}
    </>
}