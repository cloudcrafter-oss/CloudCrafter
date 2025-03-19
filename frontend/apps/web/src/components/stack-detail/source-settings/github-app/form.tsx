'use client'
import { zodResolver } from '@hookform/resolvers/zod'

import {
	type StackDetailDto,
	updateStackMutationRequestSchema,
	useUpdateStackHook,
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
import { Github, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

export const GithubAppForm = ({
	stackDetails,
	setIsEditing,
	isEditing,
}: {
	stackDetails: StackDetailDto
	setIsEditing: (isEditing: boolean) => void
	isEditing: boolean
}) => {
	const form = useForm<z.infer<typeof updateStackMutationRequestSchema>>({
		resolver: zodResolver(updateStackMutationRequestSchema),
		defaultValues: {
			stackId: stackDetails.id,
			githubSettings: {
				branch: stackDetails.source?.githubApp?.branch ?? '',
				path: stackDetails.source?.githubApp?.path ?? '',
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
			name: 'githubSettings.branch',
			label: 'Git Branch',
		},
		{
			name: 'githubSettings.path',
			label: 'Git Path',
		},
	]

	const repositoryUri = `https://www.github.com/${stackDetails.source?.githubApp?.repository}`

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmitSourceInfo)}
				className='space-y-4'
			>
				{stackDetails.source?.githubApp?.repository && (
					<div className='mb-6 flex flex-col space-y-2'>
						<div className='flex items-center space-x-2'>
							<Github className='h-5 w-5' />
							<h3 className='text-md font-medium'>Repository</h3>
						</div>
						<div className='flex items-center'>
							<Button
								variant='outline'
								size='sm'
								asChild
								className='inline-flex items-center gap-2 hover:bg-accent hover:text-accent-foreground'
							>
								<a
									href={repositoryUri}
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center'
								>
									<span className='font-medium'>
										{stackDetails.source.githubApp.repository}
									</span>
									<span className='ml-2 text-xs text-muted-foreground'>↗</span>
								</a>
							</Button>
						</div>
					</div>
				)}

				{textFields.map((textField) => (
					<FormField
						key={textField.name}
						control={form.control}
						name={
							textField.name as 'githubSettings.path' | 'githubSettings.branch'
						}
						render={({ field }) => (
							<FormItem className='space-y-2'>
								<FormLabel htmlFor='stack-name'>{textField.label}</FormLabel>
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
									<div className='p-2 bg-muted rounded-md'>{field.value}</div>
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
						<Button type='submit' disabled={updateDetailMutation.isPending}>
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
	)
}
