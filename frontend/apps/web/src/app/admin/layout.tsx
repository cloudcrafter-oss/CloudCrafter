import { ThemeProvider } from '@/src/layout/components/theme-provider.tsx'
import AppShell from '@/src/layout/components/app-shell.tsx'
import { Layout, LayoutBody, LayoutHeader } from '@/src/layout/components/custom/layout'
import { TopNav } from '@/src/layout/components/top-nav.tsx'
import { Search } from '@/src/layout/components/search.tsx'
import ThemeSwitch from '@/src/layout/components/theme-switch.tsx'
import { UserNav } from '@/src/layout/components/user-nav.tsx'
import React from 'react'
import { TooltipProvider } from '@ui/components/ui/tooltip.tsx'

export default function NextAdminLayout({ children }: { children: React.ReactNode }) {
    return (<ThemeProvider defaultTheme={'dark'} storageKey={'cloudCraft-theme'}>
        <TooltipProvider>
            <AppShell>
                <Layout>
                    <LayoutHeader>
                        <TopNav/>
                        <div className='ml-auto flex items-center space-x-4'>
                            <Search/>
                            <ThemeSwitch/>
                            <UserNav/>
                        </div>
                    </LayoutHeader>
                    <LayoutBody>
                        {children}

                    </LayoutBody>
                </Layout>
            </AppShell>
        </TooltipProvider>
    </ThemeProvider>)
}

