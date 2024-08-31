import { createProjectAction } from '@/src/app/_actions.ts'
import { createProjectCommandCommandSchema } from '@/src/core/generated/zod/createProjectCommandCommandSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/components/ui/button.tsx'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@ui/components/ui/form.tsx'
import { Input } from '@ui/components/ui/input.tsx'
import {
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@ui/components/ui/sheet.tsx'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { toast } from 'sonner'

type FormValues = z.infer<typeof createProjectCommandCommandSchema>
export const CreateProjectSheet = ({ onClose }: { onClose: () => void }) => {
	const form = useForm<z.infer<typeof createProjectCommandCommandSchema>>({
		resolver: zodResolver(createProjectCommandCommandSchema),
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
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* Add more FormField components for other fields in your schema */}
					<Button type='submit'>Save changes</Button>
				</form>
			</Form>
		</>
	)
}
