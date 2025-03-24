import {
	createStackEnvironmentVariableGroupCommandSchema,
	usePostCreateEnvironmentVariableGroupHook,
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
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@cloudcrafter/ui/components/sheet'
import { Textarea } from '@cloudcrafter/ui/components/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

type FormData = z.infer<typeof createStackEnvironmentVariableGroupCommandSchema>

interface CreateEnvironmentVariableGroupSheetProps {
	stackId: string
	onSuccess?: () => void
}

export function CreateEnvironmentVariableGroupSheet({
	stackId,
	onSuccess,
}: CreateEnvironmentVariableGroupSheetProps) {
	const [open, setOpen] = useState(false)

	const form = useForm<FormData>({
		resolver: zodResolver(createStackEnvironmentVariableGroupCommandSchema),
		defaultValues: {
			name: '',
			description: null,
		},
	})

	const { mutate: createGroup, isPending } =
		usePostCreateEnvironmentVariableGroupHook({
			mutation: {
				onSuccess: () => {
					toast.success('Group created successfully')
					setOpen(false)
					onSuccess?.()
				},
				onError: (error) => {
					toast.error('Failed to create group. Please try again.')
				},
			},
		})

	// Reset form when sheet is closed
	useEffect(() => {
		if (!open) {
			form.reset()
		}
	}, [open, form])

	const onSubmit = (data: FormData) => {
		createGroup({
			stackId,
			data,
		})
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant='outline'>Create Group</Button>
			</SheetTrigger>
			<SheetContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						<SheetHeader>
							<SheetTitle>Create Environment Variable Group</SheetTitle>
							<SheetDescription>
								Create a new group to organize your environment variables.
							</SheetDescription>
						</SheetHeader>
						<div className='space-y-4'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder='e.g., Database Configuration'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Optional description for this group'
												className='resize-none'
												rows={4}
												{...field}
												value={field.value || ''}
												onChange={(e) => field.onChange(e.target.value || null)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<SheetFooter>
							<Button type='submit' disabled={isPending}>
								{isPending ? 'Creating...' : 'Create Group'}
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
