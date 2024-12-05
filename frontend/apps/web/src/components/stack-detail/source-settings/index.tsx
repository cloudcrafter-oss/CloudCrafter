'use client'

import { useUpdateStackHook } from '@cloudcrafter/api'
import { updateStackMutationRequestSchema } from '@cloudcrafter/api'
import type { StackDetailDto } from '@cloudcrafter/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@cloudcrafter/ui/components/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@cloudcrafter/ui/components/form'
import { Input } from '@cloudcrafter/ui/components/input'
import { Loader2, PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
export const SourceSettings = ({
	stackDetails,
}: { stackDetails: StackDetailDto }) => {
	const [isEditing, setIsEditing] = useState(false)

	const form = useForm<z.infer<typeof updateStackMutationRequestSchema>>({
		resolver: zodResolver(updateStackMutationRequestSchema),
		defaultValues: {
			stackId: stackDetails.id,
			gitSettings: {
				gitRepository: stackDetails.source?.gitRepository ?? '',
				gitBranch: stackDetails.source?.gitBranch ?? '',
				gitPath: stackDetails.source?.gitPath ?? '',
			},
		},
	})

	const updateDetailMutation = useUpdateStackHook()

	const onSubmitSourceInfo = async (
		values: z.infer<typeof updateStackMutationRequestSchema>,
	) => {
		await updateDetailMutation.mutateAsync({
			id: stackDetails.id,
			data: values,
		})
		setIsEditing(false)
		toast.success('Source settings have been updated!')
	}

	const formValues = form.watch()

	const formDisabled = updateDetailMutation.isPending

	const textFields = [
		{
			name: 'gitSettings.gitRepository',
			label: 'Git Repository',
		},
		{
			name: 'gitSettings.gitPath',
			label: 'Git Path',
		},
		{ name: 'gitSettings.gitBranch', label: 'Git Branch' },
	]
	return (
		<div className='space-y-6'>
			<Card>
				<CardHeader className='relative'>
					<CardTitle>Source information</CardTitle>
					<CardDescription>
						Basic details about the source of this Stack
					</CardDescription>
					<div className='absolute top-4 right-4 flex items-center space-x-2'>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setIsEditing(!isEditing)}
						>
							<PencilIcon className='h-4 w-4' />
						</Button>
					</div>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmitSourceInfo)}
							className='space-y-4'
						>
							{textFields.map((textField) => (
								<FormField
									key={textField.name}
									control={form.control}
									name={
										textField.name as
											| 'gitSettings.gitRepository'
											| 'gitSettings.gitPath'
											| 'gitSettings.gitBranch'
									}
									render={({ field }) => (
										<FormItem className='space-y-2'>
											<FormLabel htmlFor='stack-name'>
												{textField.label}
											</FormLabel>
											{isEditing ? (
												<FormControl>
													<Input
														disabled={formDisabled}
														// placeholder={stackDetails.name || ''}
														{...field}
														value={field.value ?? ''}
													/>
												</FormControl>
											) : (
												<div className='p-2 bg-muted rounded-md'>
													{field.value}
												</div>
											)}
											<FormMessage />
										</FormItem>
									)}
								/>
							))}

							<pre className='p-4 bg-muted rounded-md overflow-auto'>
								{JSON.stringify(formValues, null, 2)}
							</pre>

							{isEditing && (
								<div className='flex justify-end space-x-2'>
									<Button
										type='submit'
										disabled={updateDetailMutation.isPending}
									>
										{updateDetailMutation.isPending ? (
											<div className='flex items-center gap-2'>
												<Loader2 className='h-4 w-4 animate-spin' />
												Saving...
											</div>
										) : (
											'Save Changes'
										)}
									</Button>
								</div>
							)}
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
