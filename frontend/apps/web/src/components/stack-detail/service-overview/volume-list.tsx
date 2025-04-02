import {
	type StackServiceVolumeDto,
	stackServiceVolumeTypeDtoEnum,
	useGetStackServiceVolumesHook,
} from '@cloudcrafter/api'
import { Button } from '@cloudcrafter/ui/components/button'
import { TabsContent } from '@cloudcrafter/ui/components/tabs'
import { HardDrive, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { DeleteAlert } from './delete-alert'
import { VolumeSheet } from './volume-sheet'

interface VolumeListProps {
	stackId: string
	stackServiceId: string
}

export const VolumeList = ({ stackId, stackServiceId }: VolumeListProps) => {
	const [isVolumeSheetOpen, setIsVolumeSheetOpen] = useState(false)
	const [editingVolume, setEditingVolume] =
		useState<StackServiceVolumeDto | null>(null)
	const [deletingVolume, setDeletingVolume] =
		useState<StackServiceVolumeDto | null>(null)

	const {
		data: volumes = [],
		isLoading,
		refetch: refetchVolumes,
	} = useGetStackServiceVolumesHook(stackId, stackServiceId)

	const handleAddVolume = () => {
		setEditingVolume(null)
		setIsVolumeSheetOpen(true)
	}

	const handleEditVolume = (volume: StackServiceVolumeDto) => {
		setEditingVolume(volume)
		setIsVolumeSheetOpen(true)
	}

	const handleDeleteVolume = (volume: StackServiceVolumeDto) => {
		setDeletingVolume(volume)
	}

	const confirmDeleteVolume = () => {
		if (deletingVolume) {
			// TODO: Implement delete mutation
			toast.success('Volume deleted successfully')
			setDeletingVolume(null)
		}
	}

	if (isLoading) {
		return (
			<TabsContent value='storage' className='mt-0'>
				<div className='text-center py-6 sm:py-8 bg-secondary/50 rounded-lg border'>
					<p className='text-sm sm:text-base font-medium'>Loading volumes...</p>
				</div>
			</TabsContent>
		)
	}

	return (
		<TabsContent value='storage' className='mt-0'>
			<div className='space-y-4 sm:space-y-6'>
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6'>
					<div className='space-y-1'>
						<h3 className='text-lg sm:text-xl font-semibold'>
							Storage Configuration
						</h3>
						<p className='text-xs sm:text-sm text-muted-foreground'>
							Configure persisted storage volumes for your service
						</p>
					</div>
					<Button
						variant='outline'
						size='sm'
						onClick={handleAddVolume}
						className='w-full sm:w-auto'
					>
						<Plus className='h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2' />
						Add Volume
					</Button>
				</div>

				<div className='grid grid-cols-1 gap-3 sm:gap-4'>
					{volumes.map((volume) => (
						<div
							key={volume.id}
							className='flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-secondary/50 rounded-lg border group gap-3 sm:gap-4'
						>
							<div className='flex items-start gap-3'>
								<div className='mt-1'>
									<span className='inline-flex items-center justify-center rounded-md bg-primary/10 p-1.5 sm:p-2'>
										<HardDrive className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary' />
									</span>
								</div>
								<div>
									<h4 className='font-medium text-sm sm:text-base'>
										{volume.name}
									</h4>
									<p className='text-xs sm:text-sm text-muted-foreground'>
										{volume.type ===
										stackServiceVolumeTypeDtoEnum.LocalMount ? (
											<>
												Source: {volume.sourcePath}
												<br />
												Destination: {volume.destinationPath}
											</>
										) : (
											<>Docker Volume: {volume.destinationPath}</>
										)}
									</p>
									<div className='flex items-center gap-2 mt-1'>
										<span className='inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/20 px-1.5 sm:px-2 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300 ring-1 ring-inset ring-blue-600/10'>
											{volume.type === stackServiceVolumeTypeDtoEnum.LocalMount
												? 'Local Mount'
												: 'Docker Volume'}
										</span>
									</div>
								</div>
							</div>
							<div className='flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity border-t sm:border-0 pt-3 sm:pt-0'>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => handleEditVolume(volume)}
									className='flex-1 sm:flex-none'
								>
									Edit
								</Button>
								<Button
									variant='ghost'
									size='sm'
									className='text-destructive hover:text-destructive flex-1 sm:flex-none'
									onClick={() => handleDeleteVolume(volume)}
								>
									<Trash2 className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
								</Button>
							</div>
						</div>
					))}
					{volumes.length === 0 && (
						<div className='text-center py-6 sm:py-8 bg-secondary/50 rounded-lg border'>
							<HardDrive className='h-6 w-6 sm:h-8 sm:w-8 mx-auto text-muted-foreground mb-2 sm:mb-3' />
							<p className='text-sm sm:text-base font-medium mb-1'>
								No volumes configured
							</p>
							<p className='text-xs sm:text-sm text-muted-foreground'>
								Add a volume to persist data for this service
							</p>
						</div>
					)}
				</div>
			</div>

			<VolumeSheet
				stackId={stackId}
				stackServiceId={stackServiceId}
				open={isVolumeSheetOpen}
				onOpenChange={setIsVolumeSheetOpen}
				editingVolume={editingVolume}
				onSuccess={refetchVolumes}
			/>

			<DeleteAlert
				open={!!deletingVolume}
				onOpenChange={(open) => !open && setDeletingVolume(null)}
				title='Delete Volume'
				description={`Are you sure you want to delete the volume "${deletingVolume?.name}"? This action cannot be undone.`}
				onConfirm={confirmDeleteVolume}
			/>
		</TabsContent>
	)
}
