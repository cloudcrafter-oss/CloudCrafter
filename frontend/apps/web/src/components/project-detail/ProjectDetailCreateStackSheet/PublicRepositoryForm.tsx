import {
	type StackCreatedDto,
	usePostCreateStackHook,
	usePostValidateGithubRepoHook,
} from '@cloudcrafter/api'
import { createStackCommandCommandSchema } from '@cloudcrafter/api'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@cloudcrafter/ui/components/form'
import { Input } from '@cloudcrafter/ui/components/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'
import { ServerSelect } from './ServerSelect'

interface PublicRepositoryFormProps {
	environmentId: string
	onBack: () => void
	onStackCreated: (stack: StackCreatedDto) => void
}

export const PublicRepositoryForm = ({
	environmentId,
	onBack,
	onStackCreated,
}: PublicRepositoryFormProps) => {
	const [formIsSubmitting, setFormIsSubmitting] = useState(false)
	const form = useForm<z.infer<typeof createStackCommandCommandSchema>>({
		resolver: zodResolver(createStackCommandCommandSchema),
		defaultValues: {
			gitRepository: 'https://github.com/cloudcrafter-oss/demo-examples',
			name: '',
			environmentId,
		},
	})

	const { mutateAsync: validateRepo, isPending } =
		usePostValidateGithubRepoHook()
	const { mutateAsync: createStack } = usePostCreateStackHook()

	const onSubmit = async (
		values: z.infer<typeof createStackCommandCommandSchema>,
	) => {
		setFormIsSubmitting(true)
		try {
			const isValid = await validateRepo({
				data: { repository: values.gitRepository },
			})
			if (!isValid) {
				form.setError('gitRepository', {
					type: 'manual',
					message: 'The provided Git repository is not valid',
				})
				return
			}
			const createdStackFromApi = await createStack({ data: values })
			onStackCreated(createdStackFromApi)
		} finally {
			setFormIsSubmitting(false)
		}
	}

	const handleValidateRepo = async (url: string) => {
		try {
			const result = await validateRepo({
				data: { repository: url },
			})
			if (!result.isValid) {
				form.setError('gitRepository', {
					type: 'manual',
					message: 'The provided Git repository is not valid',
				})
			} else {
				form.clearErrors('gitRepository')
			}
		} catch (error) {
			form.setError('gitRepository', {
				type: 'manual',
				message: 'The provided Git repository is not valid',
			})
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem className='space-y-2'>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									disabled={formIsSubmitting}
									{...field}
									autoComplete='off'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='gitRepository'
					render={({ field }) => (
						<FormItem className='space-y-2'>
							<FormLabel>Git Repository (Public)</FormLabel>
							<div className='flex space-x-2'>
								<FormControl>
									<Input
										{...field}
										disabled={formIsSubmitting || isPending}
										autoComplete='off'
										onBlur={(e) => {
											field.onBlur()
											handleValidateRepo(e.target.value)
										}}
									/>
								</FormControl>
								<Button
									type='button'
									size='icon'
									variant={
										form.formState.errors.gitRepository
											? 'destructive'
											: 'outline'
									}
									onClick={() => handleValidateRepo(field.value)}
									disabled={formIsSubmitting || isPending}
								>
									{isPending ? (
										<Loader2 className='h-4 w-4 animate-spin' />
									) : form.formState.errors.gitRepository ? (
										<XCircle className='h-4 w-4 ' />
									) : (
										<CheckCircle className='h-4 w-4' />
									)}
								</Button>
							</div>
							<FormDescription>
								Enter the URL of your public Git repository.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<ServerSelect form={form} inputDisabled={formIsSubmitting} />

				<div className='flex justify-between'>
					<Button type='button' variant='outline' onClick={onBack}>
						Back
					</Button>
					<Button type='submit' disabled={formIsSubmitting}>
						{formIsSubmitting && (
							<Loader2 className='h-4 w-4 animate-spin mr-2' />
						)}
						Add Stack
					</Button>
				</div>
			</form>
		</Form>
	)
}
