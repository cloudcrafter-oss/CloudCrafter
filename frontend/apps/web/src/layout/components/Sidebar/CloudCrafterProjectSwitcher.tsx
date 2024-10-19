'use client'
import type { ProjectDto } from '@/src/core/__generated__'
import { useSelectedProjectAndEnvironment } from '@/src/hooks/useSelectedProjectAndEnvironment'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@ui/components/ui/sidebar'
import {
	Check,
	ChevronsUpDown,
	FolderIcon,
	Plus,
	ServerIcon,
} from 'lucide-react'
import * as React from 'react'

export function CloudCrafterProjectSwitcher({
	teams,
	projects,
}: {
	teams: {
		name: string
		logo: React.ElementType
		plan: string
	}[]
	projects: ProjectDto[]
}) {
	const { isMobile } = useSidebar()
	const [activeTeam, setActiveTeam] = React.useState(teams[0])

	const { selectedProjectId, selectedEnvironmentId } =
		useSelectedProjectAndEnvironment(projects)

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
						>
							<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
								<activeTeam.logo className='size-4' />
							</div>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-semibold'>
									{activeTeam.name}
								</span>
								<span className='truncate text-xs'>{activeTeam.plan}</span>
							</div>
							<ChevronsUpDown className='ml-auto' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
						align='start'
						side={isMobile ? 'bottom' : 'right'}
						sideOffset={4}
					>
						<DropdownMenuLabel className='text-xs text-muted-foreground'>
							Teams
						</DropdownMenuLabel>
						{teams.map((team, index) => (
							<DropdownMenuItem
								key={team.name}
								onClick={() => setActiveTeam(team)}
								className='gap-2 p-2'
							>
								<div className='flex size-6 items-center justify-center rounded-sm border'>
									<team.logo className='size-4 shrink-0' />
								</div>
								{team.name}
								<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuLabel className='text-xs text-muted-foreground'>
							Projects
						</DropdownMenuLabel>
						{projects.map((project) => (
							<DropdownMenuGroup key={project.id}>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger className='gap-2 p-2'>
										<FolderIcon className='size-4' />
										{project.name}
									</DropdownMenuSubTrigger>
									<DropdownMenuSubContent>
										{project.environments.map((env) => (
											<DropdownMenuItem
												key={env.id}
												className='gap-2 p-2'
												onClick={() => {
													// Handle environment selection
												}}
											>
												<ServerIcon className='size-4' />
												{env.name}
												{selectedProjectId === project.id &&
													selectedEnvironmentId === env.id && (
														<Check className='ml-auto size-4' />
													)}
											</DropdownMenuItem>
										))}
									</DropdownMenuSubContent>
								</DropdownMenuSub>
							</DropdownMenuGroup>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem className='gap-2 p-2'>
							<div className='flex size-6 items-center justify-center rounded-md border bg-background'>
								<Plus className='size-4' />
							</div>
							<div className='font-medium text-muted-foreground'>Add team</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
