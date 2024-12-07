'use client'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@cloudcrafter/ui/components/dropdown-menu'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@cloudcrafter/ui/components/sidebar'
import {
	AudioWaveform,
	Command,
	FolderKey,
	Frame,
	GalleryVerticalEnd,
	LayoutDashboard,
	Map as MapIcon,
	Moon,
	PieChart,
	Server,
	Settings,
	Sun,
	UsersRound,
} from 'lucide-react'
import type * as React from 'react'
import { useEffect } from 'react'
import { useTheme } from '../theme-provider'
import { CloudCrafterNav } from './CloudCrafterNav'
import { CloudCrafterProjectSwitcher } from './CloudCrafterProjectSwitcher'
import { CloudCrafterUserNav } from './CloudCrafterUserNav'

// This is sample data.
const data = {
	user: {
		name: 'shadcn',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg',
	},
	teams: [
		{
			name: 'Acme Inc',
			logo: GalleryVerticalEnd,
			plan: 'Enterprise',
		},
		{
			name: 'Acme Corp.',
			logo: AudioWaveform,
			plan: 'Startup',
		},
		{
			name: 'Evil Corp.',
			logo: Command,
			plan: 'Free',
		},
	],
	navMain: [
		{
			title: 'Dashboard',
			url: '/admin',
			icon: LayoutDashboard,
			isActive: true,
		},
		{
			title: 'Users',
			url: '/admin/users',
			icon: UsersRound,
			items: [
				{
					title: 'Overview',
					url: '/admin/users',
				},
				{
					title: 'Create User',
					url: '/admin/users/create',
				},
			],
		},
		{
			title: 'Projects',
			url: '/admin/projects',
			icon: FolderKey,
			items: [
				{
					title: 'Overview',
					url: '/admin/projects',
				},
			],
		},
		{
			title: 'Servers',
			url: '/admin/servers',
			icon: Server,
			items: [
				{
					title: 'Overview',
					url: '/admin/servers',
				},
			],
		},
		{
			title: 'Settings',
			url: '/admin/settings',
			icon: Settings,
			items: [
				{
					title: 'Git Providers',
					url: '/admin/settings/git-providers',
				},
			],
		},
	],
	projects: [
		{
			name: 'Design Engineering',
			url: '#',
			icon: Frame,
		},
		{
			name: 'Sales & Marketing',
			url: '#',
			icon: PieChart,
		},
		{
			name: 'Travel',
			url: '#',
			icon: MapIcon,
		},
	],
}

export function CloudCrafterSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	useEffect(() => {
		// TODO: Improve this in the future
		fetch('/api/config')
			.then((response) => response.json())
			.then((data) => {
				if (localStorage) {
					localStorage.setItem('cloudcrafter-config', JSON.stringify(data))
				}
			})
	}, [])

	const { theme, setTheme } = useTheme()
	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader>
				<CloudCrafterProjectSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<CloudCrafterNav items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<div className='flex items-center justify-between px-4 py-2'>
					<CloudCrafterUserNav user={data.user} />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' size='icon'>
								<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
								<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
								<span className='sr-only'>Toggle theme</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem onClick={() => setTheme('light')}>
								Light {theme === 'light' ? '🌞' : ''}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme('dark')}>
								Dark {theme === 'dark' ? '🌙' : ''}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme('system')}>
								System {theme === 'system' ? '💻' : ''}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
