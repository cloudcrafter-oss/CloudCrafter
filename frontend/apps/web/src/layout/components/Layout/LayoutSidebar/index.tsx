'use client'
import { useState } from 'react'
import { IconChevronsLeft } from '@tabler/icons-react'
import { cn } from '@ui/lib/utils.ts'
import { LayoutSidebarNav } from '@/src/layout/components/Layout/LayoutSidebar/LayoutSidebarNav'
import { NavItem } from '@/src/layout/components/Layout/LayoutSidebar/types'
import { FolderKey, LayoutDashboard, List, Server, UserRoundPlus, UsersRound } from 'lucide-react'
import { useSidebar } from '@/src/layout/components/Layout/LayoutSidebar/useSidebar.tsx'

export const NavItems: NavItem[] = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin',
    },
    {
        title: 'Users',
        icon: UsersRound,
        href: '/admin/users',
        isChildren: true,
        children: [
            {
                title: 'Overview',
                icon: List,
                href: '/admin/users',
            },
            {
                title: 'Create user',
                icon: UserRoundPlus,
                href: '/admin/users/create',
            },
        ],
    },
    {
        title: 'Projects',
        icon: FolderKey,
        href: '/admin/projects',
    },
    {
        title: 'Servers',
        icon: Server,
        href: '/admin/servers',
    }
]


export const LayoutSidebar = ({ className }: { className?: string }) => {
    const { isOpen, toggle } = useSidebar()
    const [status, setStatus] = useState(false)

    const handleToggle = () => {
        setStatus(true)
        toggle()
        setTimeout(() => setStatus(false), 500)
    }
    return (
        <nav
            className={cn(
                'relative hidden h-screen border-r pt-20 md:block',
                status && 'duration-500',
                isOpen ? 'w-72' : 'w-[78px]',
                className
            )}
        >
            <IconChevronsLeft
                className={cn(
                    'absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
                    !isOpen && 'rotate-180'
                )}
                onClick={handleToggle}
            />
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="mt-3 space-y-1">
                        <LayoutSidebarNav
                            className="text-background opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100"
                            items={NavItems}
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}