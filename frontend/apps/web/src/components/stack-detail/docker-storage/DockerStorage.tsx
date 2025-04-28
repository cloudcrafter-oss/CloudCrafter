'use client'

import { Button } from '@cloudcrafter/ui/components/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@cloudcrafter/ui/components/card'
import { Label } from '@cloudcrafter/ui/components/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@cloudcrafter/ui/components/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@cloudcrafter/ui/components/table'
import { Link, Plus } from 'lucide-react'
import { useState } from 'react'
import { VolumeAttachDialog } from './VolumeAttachDialog'
import type { Volume } from './VolumeEditSheet'
import { VolumeEditSheet } from './VolumeEditSheet'

// Mock data for demonstration
const mockVolumes: Volume[] = [
	{
		id: 'vol1',
		name: 'db-data',
		path: '/var/lib/postgresql/data',
		size: '1.2 GB',
		containers: ['postgres'],
		type: 'local',
	},
	{
		id: 'vol2',
		name: 'app-logs',
		path: '/var/log/app',
		size: '450 MB',
		containers: ['app-server'],
		type: 'local',
	},
	{
		id: 'vol3',
		name: 'redis-data',
		path: '/data',
		size: '250 MB',
		containers: ['redis'],
		type: 'local',
	},
	{
		id: 'vol4',
		name: 'shared-assets',
		path: '/assets',
		size: '3.5 GB',
		containers: ['web-server', 'media-processor'],
		type: 'nfs',
	},
]

interface DockerStorageProps {
	stackDetails: unknown // Using unknown to avoid import issues
}

export const DockerStorage = ({ stackDetails }: DockerStorageProps) => {
	const [volumes, setVolumes] = useState<Volume[]>(mockVolumes)
	const [isSheetOpen, setIsSheetOpen] = useState(false)
	const [isAttachDialogOpen, setIsAttachDialogOpen] = useState(false)
	const [editingVolume, setEditingVolume] = useState<Volume | null>(null)
	const [selectedVolume, setSelectedVolume] = useState<Volume | null>(null)

	const handleEditVolume = (volume: Volume) => {
		setEditingVolume(volume)
		setIsSheetOpen(true)
	}

	const handleAddVolume = () => {
		setEditingVolume(null)
		setIsSheetOpen(true)
	}

	const handleAttachVolume = (volume: Volume) => {
		setSelectedVolume(volume)
		setIsAttachDialogOpen(true)
	}

	const handleAttachContainers = (volumeId: string, containers: string[]) => {
		setVolumes(
			volumes.map((vol) =>
				vol.id === volumeId ? { ...vol, containers } : vol,
			),
		)
	}

	const handleSaveVolume = (
		volumeData: Omit<Volume, 'id' | 'size' | 'containers'>,
		isNew: boolean,
	) => {
		if (isNew) {
			// Create new volume
			const newVolume: Volume = {
				id: `vol${volumes.length + 1}`,
				name: volumeData.name,
				path: volumeData.path,
				type: volumeData.type,
				size: '0 B',
				containers: [],
			}
			setVolumes([...volumes, newVolume])
		} else if (editingVolume) {
			// Update existing volume
			setVolumes(
				volumes.map((vol) =>
					vol.id === editingVolume.id ? { ...vol, ...volumeData } : vol,
				),
			)
		}
	}

	const handleDeleteVolume = (id: string) => {
		setVolumes(volumes.filter((volume) => volume.id !== id))
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-2xl font-bold tracking-tight'>Docker Storage</h2>
					<p className='text-muted-foreground'>
						Manage persisted storage volumes for your Docker containers
					</p>
				</div>
				<Button onClick={handleAddVolume}>
					<Plus className='mr-2 h-4 w-4' />
					Add Volume
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Persistent Volumes</CardTitle>
					<CardDescription>
						Volumes that persist data beyond the lifecycle of containers
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Mount Path</TableHead>
								<TableHead>Size</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Linked Containers</TableHead>
								<TableHead className='text-right'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{volumes.map((volume) => (
								<TableRow key={volume.id}>
									<TableCell className='font-medium'>{volume.name}</TableCell>
									<TableCell>{volume.path}</TableCell>
									<TableCell>{volume.size}</TableCell>
									<TableCell>
										<span className='capitalize'>{volume.type}</span>
									</TableCell>
									<TableCell>
										{volume.containers.length > 0 ? (
											<div className='flex flex-wrap gap-1'>
												{volume.containers.map((container) => (
													<span
														key={container}
														className='inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-300 ring-1 ring-inset ring-blue-600/10'
													>
														{container}
													</span>
												))}
											</div>
										) : (
											<span className='text-muted-foreground text-sm'>
												No containers
											</span>
										)}
									</TableCell>
									<TableCell className='text-right'>
										<div className='flex justify-end gap-2'>
											<Button
												variant='outline'
												size='sm'
												onClick={() => handleAttachVolume(volume)}
											>
												<Link className='h-3.5 w-3.5 mr-1' />
												Attach
											</Button>
											<Button
												variant='outline'
												size='sm'
												onClick={() => handleEditVolume(volume)}
											>
												Edit
											</Button>
											<Button
												variant='destructive'
												size='sm'
												onClick={() => handleDeleteVolume(volume.id)}
											>
												Delete
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
							{volumes.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={6}
										className='text-center py-6 text-muted-foreground'
									>
										No volumes configured. Add a volume to get started.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Storage Usage</CardTitle>
					<CardDescription>
						Overview of storage allocation across containers
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='h-[200px] w-full bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center'>
						<p className='text-muted-foreground'>
							Storage usage visualization would go here
						</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Backup Configuration</CardTitle>
					<CardDescription>
						Configure automated backups for your persistent volumes
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<div className='flex items-center space-x-2'>
							<input
								type='checkbox'
								id='enable-backups'
								className='h-4 w-4 rounded border-gray-300'
							/>
							<Label htmlFor='enable-backups'>Enable automated backups</Label>
						</div>
						<div className='grid grid-cols-3 gap-4'>
							<div>
								<Label htmlFor='backup-frequency'>Backup Frequency</Label>
								<Select disabled defaultValue='daily'>
									<SelectTrigger id='backup-frequency'>
										<SelectValue placeholder='Select frequency' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='hourly'>Hourly</SelectItem>
										<SelectItem value='daily'>Daily</SelectItem>
										<SelectItem value='weekly'>Weekly</SelectItem>
										<SelectItem value='monthly'>Monthly</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor='retention-period'>Retention Period</Label>
								<Select disabled defaultValue='30days'>
									<SelectTrigger id='retention-period'>
										<SelectValue placeholder='Select period' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='7days'>7 Days</SelectItem>
										<SelectItem value='30days'>30 Days</SelectItem>
										<SelectItem value='90days'>90 Days</SelectItem>
										<SelectItem value='365days'>1 Year</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor='storage-location'>Storage Location</Label>
								<Select disabled defaultValue='s3'>
									<SelectTrigger id='storage-location'>
										<SelectValue placeholder='Select location' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='local'>Local</SelectItem>
										<SelectItem value='s3'>AWS S3</SelectItem>
										<SelectItem value='azure'>Azure Blob</SelectItem>
										<SelectItem value='gcs'>Google Cloud Storage</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<Button disabled variant='outline'>
							Configure Backup Settings
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Volume Edit Sheet */}
			<VolumeEditSheet
				open={isSheetOpen}
				onOpenChange={setIsSheetOpen}
				editingVolume={editingVolume}
				onSave={handleSaveVolume}
			/>

			{/* Volume Attach Dialog */}
			{selectedVolume && (
				<VolumeAttachDialog
					open={isAttachDialogOpen}
					onOpenChange={setIsAttachDialogOpen}
					volume={selectedVolume}
					onAttach={handleAttachContainers}
				/>
			)}
		</div>
	)
}
