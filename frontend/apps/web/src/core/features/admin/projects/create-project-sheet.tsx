import { createProjectAction } from '@/src/app/_actions'
import {
	createProjectCommandSchema,
	useGetMyTeamsHook,
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
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@cloudcrafter/ui/components/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

type FormValues = z.infer<typeof createProjectCommandSchema>
export const CreateProjectSheet = ({ onClose }: { onClose: () => void }) => {
	const form = useForm<z.infer<typeof createProjectCommandSchema>>({
		resolver: zodResolver(createProjectCommandSchema),
		defaultValues: {
			name: '',
			teamId: '',
		},
	})

	const { data: teams } = useGetMyTeamsHook()

	const onSubmit = async (data: FormValues) => {
		await createProjectAction(data)

		toast.success('Project created successfully')
		onClose()
	}

	const formErrors = form.formState.errors

	return (
		<>
			<SheetHeader>
				<SheetTitle>Add New Project</SheetTitle>
				<SheetDescription>
					Create a new project here. Click save when you're done.
				</SheetDescription>
			</SheetHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex flex-col gap-4 p-4'
				>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input data-testid='input-project-name' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='teamId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Team</FormLabel>
								<Select
									data-testid='select-team'
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className='w-full'>
											<SelectValue
												data-testid='default-value'
												placeholder='Select a team'
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{teams?.map((team) => (
											<SelectItem
												key={team.id}
												value={team.id}
												data-testid={`select-item-${team.id}`}
											>
												{team.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					{Object.keys(formErrors).length > 0 && (
						<div className='mt-2 space-y-1'>
							{Object.entries(formErrors).map(([key, error]) => (
								<p key={key} className='text-sm text-destructive'>
									{key}: {error.message}
								</p>
							))}
						</div>
					)}
					<Button data-testid='btn-save-project' type='submit'>
						Save changes
					</Button>
				</form>
			</Form>
		</>
	)
}
