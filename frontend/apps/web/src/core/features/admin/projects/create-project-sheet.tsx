import { createProjectAction } from '@/src/app/_actions'
import { createProjectCommandSchema } from '@cloudcrafter/api'
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
		},
	})

	const onSubmit = async (data: FormValues) => {
		await createProjectAction(data)

		toast.success('Project created successfully')
		onClose()
	}

	return (
		<>
			<SheetHeader>
				<SheetTitle>Add New Project</SheetTitle>
				<SheetDescription>
					Create a new project here. Click save when you're done.
				</SheetDescription>
			</SheetHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
					{/* Add more FormField components for other fields in your schema */}
					<Button data-testid='btn-save-project' type='submit'>
						Save changes
					</Button>
				</form>
			</Form>
		</>
	)
}
