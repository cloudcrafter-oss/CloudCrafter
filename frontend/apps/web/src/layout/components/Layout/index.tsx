import React from 'react'
import { LayoutSidebar } from '@/src/layout/components/Layout/LayoutSidebar'
import { LayoutHeader } from '@/src/layout/components/Layout/LayoutHeader'

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <LayoutHeader/>
            <div className="flex h-screen border-collapse overflow-hidden">
                <LayoutSidebar/>
                <main className="flex-1 overflow-y-auto overflow-x-hidden pt-10 bg-secondary/10 pb-1">
                    {children}
                </main>
            </div>
        </>
    )
}