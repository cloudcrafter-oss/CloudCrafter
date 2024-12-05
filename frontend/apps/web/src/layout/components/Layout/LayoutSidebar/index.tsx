'use client'
import { fetchProjectsWithEnvironments } from '@/src/app/_actions/project'
import { useSelectedProductEnvironmentUuids } from '@/src/hooks/useSelectedProductEnvironmentUuids'
import { LayoutSidebarNav } from '@/src/layout/components/Layout/LayoutSidebar/LayoutSidebarNav'
import type { NavItem } from '@/src/layout/components/Layout/LayoutSidebar/types'
import { useSidebar } from '@/src/layout/components/Layout/LayoutSidebar/useSidebar'
import { IconChevronsLeft } from '@tabler/icons-react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@cloudcrafter/ui/components/select'
import { cn } from '@cloudcrafter/ui/lib/utils'
import {
	FolderKey,
	LayoutDashboard,
	List,
	Server,
	UserRoundPlus,
	UsersRound,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'

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
	},
]

export const LayoutSidebar = ({ className }: { className?: string }) => {
	const router = useRouter()
	const { isOpen, toggle } = useSidebar()
	const [status, setStatus] = useState(false)

	const { data: projects } = useSWR(
		'userProjects',
		fetchProjectsWithEnvironments,
	)

	const {
		projectUuid: currentProjectFromRoute,
		environmentUuid: currentEnvironmentFromRoute,
	} = useSelectedProductEnvironmentUuids()

	const handleToggle = () => {
		setStatus(true)
		toggle()
		setTimeout(() => setStatus(false), 500)
	}

	const handleSelectChange = (value: string) => {
		if (value.includes('|')) {
			// It's a project-environment combination
			const [projectId, envId] = value.split('|')
			router.push(`/admin/projects/${projectId}/${envId}`)
		}
	}

	return (
		<nav
			className={cn(
				'relative hidden h-screen border-r pt-10 md:block',
				status && 'duration-500',
				isOpen ? 'w-72' : 'w-[78px]',
				className,
			)}
		>
			<IconChevronsLeft
				className={cn(
					'absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
					!isOpen && 'rotate-180',
				)}
				onClick={handleToggle}
			/>

			<div className='px-3'>
				<div className='mt-3'>
					<div className='p-4'>
						<Select
							value={`${currentProjectFromRoute}|${currentEnvironmentFromRoute}`}
							onValueChange={handleSelectChange}
						>
							<SelectTrigger className='w-full text-left'>
								<SelectValue placeholder='Select project and environment' />
							</SelectTrigger>
							<SelectContent>
								{projects?.flatMap((project) =>
									project.environments.map((env) => (
										<SelectItem
											key={`${project.id}-${env.id}`}
											value={`${project.id}|${env.id}`}
										>
											{`${project.name} - ${env.name}`}
										</SelectItem>
									)),
								)}
							</SelectContent>
						</Select>
					</div>
					<LayoutSidebarNav
						className='text-background opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100'
						items={NavItems}
					/>
				</div>
			</div>
		</nav>
	)
}
