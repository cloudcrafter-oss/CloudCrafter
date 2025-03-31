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
import { useForm } from 'react-hook-form'

interface Volume {
	id: string
	name: string
	path: string
	size: string
	type: 'local' | 'nfs'
}

interface VolumeSheetProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	editingVolume: Volume | null
	onSubmit: (values: Omit<Volume, 'id' | 'size'>) => void
}

export const VolumeSheet = ({
	open,
	onOpenChange,
	editingVolume,
	onSubmit,
}: VolumeSheetProps) => {
	const volumeForm = useForm<Omit<Volume, 'id' | 'size'>>({
		defaultValues: {
			name: editingVolume?.name ?? '',
			path: editingVolume?.path ?? '',
			type: editingVolume?.type ?? 'local',
		},
	})

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
							onSubmit={volumeForm.handleSubmit(onSubmit)}
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
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select volume type' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='local'>Local Mount</SelectItem>
												<SelectItem value='nfs'>NFS Share</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={volumeForm.control}
								name='path'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Mount Path</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Enter mount path (e.g. /var/lib/data)'
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
								<Button type='submit'>
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
