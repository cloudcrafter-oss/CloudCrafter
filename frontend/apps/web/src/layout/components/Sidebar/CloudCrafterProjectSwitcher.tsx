'use client'
import { useTeams } from '@/src/hooks/useProjects'
import { useSelectedProjectAndEnvironment } from '@/src/hooks/useSelectedProjectAndEnvironment'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@cloudcrafter/ui/components/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@cloudcrafter/ui/components/sidebar'
import {
	Check,
	ChevronsUpDown,
	Cloud,
	FolderIcon,
	Plus,
	ServerIcon,
	Users,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Team {
	id: string
	name: string
	projects: {
		id: string
		name: string
		environments: {
			id: string
			name: string
		}[]
	}[]
}

const ActiveProject = () => {
	const { selectedProject, selectedEnvironment } =
		useSelectedProjectAndEnvironment()

	const title = selectedProject ? selectedProject.name : 'Select a project'

	return (
		<>
			<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
				<Cloud className='size-4' />
			</div>
			<div className='grid flex-1 text-left text-sm leading-tight'>
				<span className='truncate font-semibold'>{title}</span>
				<span className='truncate text-xs'>{selectedEnvironment?.name}</span>
			</div>
			<ChevronsUpDown className='ml-auto' />
		</>
	)
}

export function CloudCrafterProjectSwitcher() {
	const { isMobile } = useSidebar()
	const router = useRouter()
	const { teams } = useTeams()
	const { selectedProjectId, selectedEnvironmentId } =
		useSelectedProjectAndEnvironment()

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
						>
							<ActiveProject />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
						align='start'
						side={isMobile ? 'bottom' : 'right'}
						sideOffset={4}
					>
						{teams.map((team) => (
							<div key={team.id}>
								<DropdownMenuLabel className='flex items-center gap-2 text-xs text-muted-foreground'>
									<Users className='size-3' />
									{team.name} ({team.projects.length})
								</DropdownMenuLabel>
								{team.projects.map((project) => (
									<DropdownMenuGroup key={project.id}>
										<DropdownMenuSub>
											<DropdownMenuSubTrigger className='gap-2 p-2'>
												<FolderIcon className='size-4' />
												{selectedProjectId === project.id ? (
													<>
														<span className='font-semibold'>
															{project.name} ({project.environments.length})
														</span>
													</>
												) : (
													<>
														<span>
															{project.name} ({project.environments.length})
														</span>
													</>
												)}
											</DropdownMenuSubTrigger>
											<DropdownMenuSubContent>
												{project.environments.map((env) => (
													<DropdownMenuItem
														key={env.id}
														className='gap-2 p-2'
														onClick={() => {
															router.push(
																`/admin/projects/${project.id}/${env.id}`,
															)
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
							</div>
						))}
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
