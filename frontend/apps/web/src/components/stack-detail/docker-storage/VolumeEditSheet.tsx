'use client'

import { Button } from '@cloudcrafter/ui/components/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@cloudcrafter/ui/components/form'
import { Input } from '@cloudcrafter/ui/components/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@cloudcrafter/ui/components/select'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@cloudcrafter/ui/components/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Define the volume interface
export interface Volume {
	id: string
	name: string
	path: string
	size: string
	type: string
	containers: string[]
}

// Define the form schema for volume validation
const volumeFormSchema = z.object({
	name: z.string().min(1, 'Volume name is required'),
	path: z.string().min(1, 'Mount path is required'),
	type: z.string().min(1, 'Volume type is required'),
})

type VolumeFormData = z.infer<typeof volumeFormSchema>

interface VolumeEditSheetProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	editingVolume?: Volume | null
	onSave: (
		volume: Omit<Volume, 'id' | 'size' | 'containers'>,
		isNew: boolean,
	) => void
}

export function VolumeEditSheet({
	open,
	onOpenChange,
	editingVolume,
	onSave,
}: VolumeEditSheetProps) {
	const isEditMode = !!editingVolume
	const [isSubmitting, setIsSubmitting] = useState(false)

	const form = useForm<VolumeFormData>({
		resolver: zodResolver(volumeFormSchema),
		defaultValues: {
			name: editingVolume?.name || '',
			path: editingVolume?.path || '',
			type: editingVolume?.type || 'local',
		},
	})

	// Reset form when editing volume changes
	if (
		editingVolume &&
		(form.getValues('name') !== editingVolume.name ||
			form.getValues('path') !== editingVolume.path ||
			form.getValues('type') !== editingVolume.type)
	) {
		form.reset({
			name: editingVolume.name,
			path: editingVolume.path,
			type: editingVolume.type,
		})
	}

	const onSubmit = async (data: VolumeFormData) => {
		setIsSubmitting(true)

		try {
			await onSave(data, !isEditMode)
			form.reset()
			onOpenChange(false)
		} catch (error) {
			console.error('Error saving volume:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className='sm:max-w-md overflow-hidden'>
				<div className='px-4 py-4 pb-8 overflow-y-auto h-full'>
					<SheetHeader className='mb-5'>
						<SheetTitle>{isEditMode ? 'Edit Volume' : 'Add Volume'}</SheetTitle>
						<SheetDescription>
							{isEditMode
								? 'Edit the properties of your Docker volume'
								: 'Configure a new persisted volume for your Docker containers'}
						</SheetDescription>
					</SheetHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Volume Name</FormLabel>
										<FormControl>
											<Input {...field} placeholder='e.g., db-data' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='path'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Mount Path</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='e.g., /var/lib/postgresql/data'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='type'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Volume Type</FormLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select volume type' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='local'>Local Volume</SelectItem>
												<SelectItem value='nfs'>NFS Mount</SelectItem>
												<SelectItem value='aws'>AWS EBS</SelectItem>
												<SelectItem value='azure'>Azure Disk</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<SheetFooter className='pt-4'>
								<Button
									type='button'
									variant='outline'
									onClick={() => onOpenChange(false)}
								>
									Cancel
								</Button>
								<Button type='submit' disabled={isSubmitting}>
									{isSubmitting
										? 'Saving...'
										: isEditMode
											? 'Save Changes'
											: 'Create Volume'}
								</Button>
							</SheetFooter>
						</form>
					</Form>
				</div>
			</SheetContent>
		</Sheet>
	)
}
