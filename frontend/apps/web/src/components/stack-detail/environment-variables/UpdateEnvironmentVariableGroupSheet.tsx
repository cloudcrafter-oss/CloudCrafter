import {
	type StackEnvironmentVariableGroupDto,
	updateStackEnvironmentVariableGroupCommandSchema,
	usePutUpdateEnvironmentVariableGroupHook,
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
} from '@cloudcrafter/ui/components/sheet'
import { Textarea } from '@cloudcrafter/ui/components/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

type FormData = z.infer<typeof updateStackEnvironmentVariableGroupCommandSchema>

interface UpdateEnvironmentVariableGroupSheetProps {
	stackId: string
	group: StackEnvironmentVariableGroupDto
	open: boolean
	onOpenChange: (open: boolean) => void
	onSuccess?: () => void
}

export function UpdateEnvironmentVariableGroupSheet({
	stackId,
	group,
	open,
	onOpenChange,
	onSuccess,
}: UpdateEnvironmentVariableGroupSheetProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(updateStackEnvironmentVariableGroupCommandSchema),
		defaultValues: {
			name: group.name,
			description: group.description || null,
		},
	})

	const { mutate: updateGroup, isPending } =
		usePutUpdateEnvironmentVariableGroupHook({
			mutation: {
				onSuccess: () => {
					toast.success('Group updated successfully')
					onOpenChange(false)
					onSuccess?.()
				},
				onError: (error) => {
					toast.error('Failed to update group. Please try again.')
				},
			},
		})

	// Reset form when group or open state changes
	useEffect(() => {
		if (open) {
			form.reset({
				name: group.name,
				description: group.description || null,
			})
		}
	}, [open, group, form])

	const onSubmit = (data: FormData) => {
		updateGroup({
			stackId,
			id: group.id,
			data,
		})
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						<SheetHeader>
							<SheetTitle>Update Environment Variable Group</SheetTitle>
							<SheetDescription>
								Update the details of your environment variable group.
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
											<Input placeholder='Group name' {...field} />
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
										<FormLabel>Description (optional)</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Description of this group'
												{...field}
												value={field.value || ''}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<SheetFooter>
							<Button type='submit' disabled={isPending}>
								{isPending ? 'Saving...' : 'Save Changes'}
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
