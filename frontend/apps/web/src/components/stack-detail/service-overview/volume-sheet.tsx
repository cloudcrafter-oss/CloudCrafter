import type { StackServiceVolumeDto } from '@cloudcrafter/api'
import {
	createStackServiceVolumeCommandSchema,
	updateStackServiceVolumeCommandSchema,
} from '@cloudcrafter/api'
import {
	usePostCreateStackServiceVolumeHook,
	usePutUpdateStackServiceVolumeHook,
} from '@cloudcrafter/api'
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
	SheetHeader,
	SheetTitle,
} from '@cloudcrafter/ui/components/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

type VolumeFormData = z.infer<typeof createStackServiceVolumeCommandSchema>

interface VolumeSheetProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	editingVolume: StackServiceVolumeDto | null
	stackId: string
	stackServiceId: string
	onSuccess?: () => void
}

export const VolumeSheet = ({
	open,
	onOpenChange,
	editingVolume,
	stackId,
	stackServiceId,
	onSuccess,
}: VolumeSheetProps) => {
	const createVolume = usePostCreateStackServiceVolumeHook({
		mutation: {
			onSuccess: () => {
				toast.success('Volume created successfully')
				onSuccess?.()
				onOpenChange(false)
			},
			onError: (error) => {
				toast.error(`Failed to create volume: ${error.message}`)
			},
		},
	})

	const updateVolume = usePutUpdateStackServiceVolumeHook({
		mutation: {
			onSuccess: () => {
				toast.success('Volume updated successfully')
				onSuccess?.()
				onOpenChange(false)
			},
			onError: (error) => {
				toast.error(`Failed to update volume: ${error.message}`)
			},
		},
	})

	const volumeForm = useForm<VolumeFormData>({
		resolver: zodResolver(
			editingVolume
				? updateStackServiceVolumeCommandSchema
				: createStackServiceVolumeCommandSchema,
		),
		defaultValues: {
			name: editingVolume?.name ?? '',
			source: editingVolume?.sourcePath ?? '',
			target: editingVolume?.destinationPath ?? '',
			type: editingVolume?.type ?? 0, // LocalMount
		},
	})

	const onSubmit = (values: VolumeFormData) => {
		console.log('Form submitted with values:', values)
		if (editingVolume) {
			console.log('Updating volume:', editingVolume.id)
			updateVolume.mutate({
				stackId,
				stackServiceId,
				id: editingVolume.id,
				data: {
					...values,
					id: editingVolume.id,
				},
			})
		} else {
			console.log('Creating new volume')
			createVolume.mutate({
				stackId,
				stackServiceId,
				data: values,
			})
		}
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side='right' className='sm:max-w-xl w-full'>
				<SheetHeader>
					<SheetTitle>
						{editingVolume ? 'Edit Volume' : 'Add Volume'}
					</SheetTitle>
					<SheetDescription>
						{editingVolume
							? 'Edit the volume configuration for your service.'
							: 'Configure a new volume for your service.'}
					</SheetDescription>
				</SheetHeader>

				<div className='mt-6'>
					<Form {...volumeForm}>
						<form
							onSubmit={() => {
								volumeForm.handleSubmit(onSubmit)
							}}
							className='space-y-4'
						>
							<FormField
								control={volumeForm.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Volume Name</FormLabel>
										<FormControl>
											<Input {...field} placeholder='Enter volume name' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={volumeForm.control}
								name='type'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Volume Type</FormLabel>
										<Select
											onValueChange={(value) => field.onChange(Number(value))}
											defaultValue={field.value.toString()}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select volume type' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='0'>Local Mount</SelectItem>
												<SelectItem value='1'>Docker Volume</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{volumeForm.watch('type') === 0 && (
								<FormField
									control={volumeForm.control}
									name='source'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Source Path</FormLabel>
											<FormControl>
												<Input
													{...field}
													value={field.value ?? ''}
													placeholder='Enter source path (e.g. /data)'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							<FormField
								control={volumeForm.control}
								name='target'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Destination Path</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Enter destination path (e.g. /var/lib/data)'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4'>
								<Button
									type='button'
									variant='ghost'
									onClick={() => {
										onOpenChange(false)
										volumeForm.reset()
									}}
								>
									Cancel
								</Button>
								<Button
									type='submit'
									disabled={createVolume.isPending || updateVolume.isPending}
								>
									{editingVolume ? 'Save Changes' : 'Add Volume'}
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</SheetContent>
		</Sheet>
	)
}
