'use client'
import { fetchProjectsWithEnvironments } from '@/src/app/_actions/project'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@cloudcrafter/ui/components/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@cloudcrafter/ui/components/popover'
import { cn } from '@cloudcrafter/ui/lib/utils'
import { Check, ChevronRight, ChevronsUpDown } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'

export const ProjectSelector = () => {
	const params = useParams()
	const [open, setOpen] = useState(false)

	const { 'project-uuid': projectUuid, 'environment-uuid': environmentUuid } =
		params

	const { data: projects, isLoading } = useSWR(
		'userProjects',
		fetchProjectsWithEnvironments,
	)

	const selectedProject = projects?.find(
		(project) => project.id === projectUuid,
	)?.name
	const selectedEnvironment = projects
		?.find((project) => project.id === projectUuid)
		?.environments.find((env) => env.id === environmentUuid)?.name

	const isEnvActive = false

	return (
		<div className='flex items-center'>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						disabled={isLoading}
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className='justify-between'
					>
						{selectedProject && selectedEnvironment
							? `${selectedProject} / ${selectedEnvironment}`
							: 'Select project / environment...'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className=' p-0'>
					<Command>
						<CommandInput placeholder='Search environment or project...' />
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							{projects?.map((project) => (
								<CommandGroup key={project.id} heading={project.name}>
									{project.environments.map((env) => (
										<CommandItem key={env.id}>
											<Link
												href={`/admin/projects/${project.id}/${env.id}`}
												className='flex items-center w-full'
											>
												<ChevronRight className='mr-2 h-4 w-4' />
												{env.name}
												<Check
													className={cn(
														'ml-auto h-4 w-4',
														isEnvActive
															? // selectedEnvironment === env.label && selectedProject === project.label
																'opacity-100'
															: 'opacity-0',
													)}
												/>
											</Link>
										</CommandItem>
									))}
								</CommandGroup>
							))}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	)
}
