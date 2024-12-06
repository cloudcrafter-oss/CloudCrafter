import {
	IconLayoutDashboard,
	IconList,
	IconListDetails,
	IconPlus,
	IconServer,
	IconSettings,
	IconUsers,
} from '@tabler/icons-react'

export interface NavLink {
	title: string
	label?: string
	href: string
	icon: React.ReactNode
}

export interface SideLink extends NavLink {
	sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
	{
		title: 'Dashboard',
		label: '',
		href: '/',
		icon: <IconLayoutDashboard size={18} />,
	},
	{
		title: 'Users',
		label: '',
		href: '/admin/users',
		icon: <IconUsers size={18} />,
		sub: [
			{
				title: 'Overview',
				label: '',
				href: '/admin/users',
				icon: <IconList size={18} />,
			},
			{
				title: 'Create users',
				label: '',
				href: '/admin/users/create',
				icon: <IconPlus size={18} />,
			},
		],
	},
	{
		title: 'Projects',
		label: '',
		href: '/admin/projects',
		icon: <IconListDetails size={18} />,
	},
	{
		title: 'Servers',
		label: '',
		href: '/admin/servers',
		icon: <IconServer size={18} />,
	},

	{
		title: 'Settings',
		label: '',
		href: '/settings',
		icon: <IconSettings size={18} />,
	},
]
