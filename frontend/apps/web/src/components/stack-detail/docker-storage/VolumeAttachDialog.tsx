'use client'

import { Button } from '@cloudcrafter/ui/components/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@cloudcrafter/ui/components/command'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@cloudcrafter/ui/components/dialog'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@cloudcrafter/ui/components/popover'
import { cn } from '@cloudcrafter/ui/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import type { Volume } from './VolumeEditSheet'

// Mock list of available containers
const availableContainers = [
	{ id: 'container1', name: 'app-server' },
	{ id: 'container2', name: 'postgres' },
	{ id: 'container3', name: 'redis' },
	{ id: 'container4', name: 'nginx' },
	{ id: 'container5', name: 'media-processor' },
	{ id: 'container6', name: 'web-server' },
	{ id: 'container7', name: 'worker' },
	{ id: 'container8', name: 'cron' },
]

interface VolumeAttachDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	volume: Volume
	onAttach: (volumeId: string, containers: string[]) => void
}

export function VolumeAttachDialog({
	open,
	onOpenChange,
	volume,
	onAttach,
}: VolumeAttachDialogProps) {
	const [selectedContainers, setSelectedContainers] = useState<string[]>(
		volume.containers || [],
	)
	const [commandOpen, setCommandOpen] = useState(false)

	const handleAttach = () => {
		onAttach(volume.id, selectedContainers)
		onOpenChange(false)
	}

	const handleToggleContainer = (containerName: string) => {
		setSelectedContainers((current) => {
			if (current.includes(containerName)) {
				return current.filter((name) => name !== containerName)
			}
			return [...current, containerName]
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Attach Volume to Containers</DialogTitle>
					<DialogDescription>
						Select containers that should use the "{volume.name}" volume at path
						"{volume.path}"
					</DialogDescription>
				</DialogHeader>

				<div className='py-4'>
					<Popover open={commandOpen} onOpenChange={setCommandOpen}>
						<PopoverTrigger asChild>
							<Button
								type='button'
								variant='outline'
								role='combobox'
								aria-expanded={commandOpen}
								className='w-full justify-between'
							>
								{selectedContainers.length > 0
									? `${selectedContainers.length} container${selectedContainers.length > 1 ? 's' : ''} selected`
									: 'Select containers...'}
								<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
							<Command>
								<CommandInput placeholder='Search containers...' />
								<CommandEmpty>No containers found.</CommandEmpty>
								<CommandGroup>
									{availableContainers.map((container) => (
										<CommandItem
											key={container.id}
											value={container.name}
											onSelect={() => handleToggleContainer(container.name)}
										>
											<Check
												className={cn(
													'mr-2 h-4 w-4',
													selectedContainers.includes(container.name)
														? 'opacity-100'
														: 'opacity-0',
												)}
											/>
											{container.name}
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>

					{selectedContainers.length > 0 && (
						<div className='mt-4'>
							<p className='text-sm mb-2'>Selected containers:</p>
							<div className='flex flex-wrap gap-2'>
								{selectedContainers.map((name) => (
									<div
										key={name}
										className='bg-secondary px-2 py-1 rounded-md text-xs flex items-center'
									>
										{name}
										<button
											type='button'
											className='ml-2 text-muted-foreground hover:text-foreground transition-colors'
											onClick={() => handleToggleContainer(name)}
										>
											×
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button type='button' onClick={handleAttach}>
						Attach
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
