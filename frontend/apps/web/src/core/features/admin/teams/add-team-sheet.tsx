'use client'

import { createTeamCommandSchema, useCreateTeamHook } from '@cloudcrafter/api'
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
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@cloudcrafter/ui/components/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

interface AddTeamSheetProps {
	open: boolean
	setOpen: (open: boolean) => void
	onSuccess?: () => void
}

export function AddTeamSheet({ open, setOpen, onSuccess }: AddTeamSheetProps) {
	const mutation = useCreateTeamHook({
		mutation: {
			onSuccess: () => {
				toast.success('Team created successfully')
				setOpen(false)
				onSuccess?.()
			},
		},
	})

	const onSubmit = async (values: z.infer<typeof createTeamCommandSchema>) => {
		console.log(values)
		mutation.mutate({
			data: values,
		})
	}

	const form = useForm<z.infer<typeof createTeamCommandSchema>>({
		resolver: zodResolver(createTeamCommandSchema),
		defaultValues: {
			name: '',
		},
	})

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add New Team</SheetTitle>
					<SheetDescription>
						Create a new team by providing a name. Click save when you're done.
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4 py-4'
					>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Service Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											value={field.value ?? ''}
											placeholder='Enter service name'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<SheetFooter>
							<Button type='submit'>Save Team</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
