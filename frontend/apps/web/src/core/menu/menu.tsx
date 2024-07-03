import React from 'react'
import { LayoutDashboard, UsersIcon } from 'lucide-react'
import { SettingsIcon } from '@/src/app/src/features/admin/components/icons.tsx'

export interface MenuItem {
    link: string
    title: string
    logo?: React.ReactNode
}

export const menuItems: MenuItem[] = [
    {
        link: '/admin',
        title: 'Admin',
        logo: <LayoutDashboard className="h-4 w-4"/>
    },
    {
        link: '/admin/users',
        title: 'Users',
        logo: <UsersIcon className="h-4 w-4"/>
    },
    {
        link: '/admin/settings',
        title: 'Settings',
        logo: <SettingsIcon className="h-4 w-4"/>
    }
]