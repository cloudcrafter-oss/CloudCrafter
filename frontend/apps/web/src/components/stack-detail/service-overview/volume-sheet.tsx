import type { StackServiceVolumeDto } from '@cloudcrafter/api'
import {
	createStackServiceVolumeCommandSchema,
	stackServiceVolumeTypeDtoEnum,
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
				onOpenChange(false)
				onSuccess?.()
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
				onOpenChange(false)
				onSuccess?.()
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
			stackId,
			stackServiceId,
			name: editingVolume?.name ?? '',
			source: editingVolume?.sourcePath ?? null,
			target: editingVolume?.destinationPath ?? '',
			type: editingVolume?.type ?? stackServiceVolumeTypeDtoEnum.LocalMount,
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
			<SheetContent
				data-testid='modal-volume'
				side='right'
				className='sm:max-w-xl w-full'
			>
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
							onSubmit={volumeForm.handleSubmit(onSubmit)}
							className='space-y-4'
						>
							<FormField
								control={volumeForm.control}
								name={'name' satisfies keyof VolumeFormData}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Volume Name</FormLabel>
										<FormControl>
											<Input
												{...field}
												data-testid='volume-name'
												placeholder='Enter volume name'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={volumeForm.control}
								name={'type' satisfies keyof VolumeFormData}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Volume Type</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select volume type' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem
													value={stackServiceVolumeTypeDtoEnum.LocalMount}
												>
													Local Mount
												</SelectItem>
												<SelectItem
													value={stackServiceVolumeTypeDtoEnum.DockerVolume}
												>
													Docker Volume
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{volumeForm.watch('type') ===
								stackServiceVolumeTypeDtoEnum.LocalMount && (
								<FormField
									control={volumeForm.control}
									name={'source' satisfies keyof VolumeFormData}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Source Path</FormLabel>
											<FormControl>
												<Input
													{...field}
													data-testid='volume-source'
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
								name={'target' satisfies keyof VolumeFormData}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Destination Path</FormLabel>
										<FormControl>
											<Input
												{...field}
												data-testid='volume-target'
												placeholder='Enter destination path (e.g. /var/lib/data)'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='flex flex-col gap-4 pt-4'>
								{Object.keys(volumeForm.formState.errors).length > 0 && (
									<div className='rounded-md bg-red-50 dark:bg-red-900/10 p-3'>
										<div className='text-sm text-red-500'>
											{Object.entries(volumeForm.formState.errors).map(
												([key, error]) => (
													<p key={key}>
														{key}: {error?.message}
													</p>
												),
											)}
										</div>
									</div>
								)}

								<div className='flex flex-col-reverse sm:flex-row justify-end gap-2'>
									{(createVolume.error || updateVolume.error) && (
										<p className='text-sm text-red-500 mb-2'>
											{createVolume.error?.message ||
												updateVolume.error?.message ||
												'An error occurred'}
										</p>
									)}
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
										data-testid='volume-submit'
										disabled={createVolume.isPending || updateVolume.isPending}
									>
										{editingVolume ? 'Save Changes' : 'Add Volume'}
									</Button>
								</div>
							</div>
						</form>
					</Form>
				</div>
			</SheetContent>
		</Sheet>
	)
}
