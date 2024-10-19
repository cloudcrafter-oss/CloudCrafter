'use client'

import { NavMain } from '@ui/components/nav-main'
import { NavProjects } from '@ui/components/nav-projects'
import { NavUser } from '@ui/components/nav-user'
import { TeamSwitcher } from '@ui/components/team-switcher'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@ui/components/ui/sidebar'
import {
	AudioWaveform,
	Command,
	FolderKey,
	Frame,
	GalleryVerticalEnd,
	LayoutDashboard,
	Map as MapIcon,
	PieChart,
	Server,
	UsersRound,
} from 'lucide-react'
import type * as React from 'react'

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
		},
		{
			title: 'Servers',
			url: '/admin/servers',
			icon: Server,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
