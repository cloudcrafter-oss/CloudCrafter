'use client'

import {
	useGetProvidersHook,
	useGetServersHook,
	usePostCreateStackHook,
	usePostValidateGithubRepoHook,
} from '@cloudcrafter/api'
import type { StackCreatedDto } from '@cloudcrafter/api'
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@cloudcrafter/ui/components/select'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@cloudcrafter/ui/components/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Loader2, Plus, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'

const formSchema = createStackCommandCommandSchema

export const ProjectDetailCreateStackSheet = ({
	environmentId,
}: { environmentId: string }) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			gitRepository: 'https://github.com/cloudcrafter-oss/demo-examples',
			name: '',
			environmentId,
		},
	})

	const [formIsSubmitting, setFormIsSubmitting] = useState(false)
	const [createdStack, setCreatedStack] = useState<StackCreatedDto | null>(null)

	const { mutateAsync, isPending } = usePostValidateGithubRepoHook()
	const { mutateAsync: createStack } = usePostCreateStackHook()
	const { data: servers } = useGetServersHook()

	const { data: providers } = useGetProvidersHook({
		IsActive: true,
	})

	async function validateRepository(url: string) {
		const errorMessage = 'The provided Git repository is not valid'
		try {
			const result = await mutateAsync({ data: { repository: url } })
			if (!result.isValid) {
				form.setError('gitRepository', {
					type: 'manual',
					message: errorMessage,
				})
			} else {
				form.clearErrors('gitRepository')
			}
			return result.isValid
		} catch (error) {
			form.setError('gitRepository', {
				type: 'manual',
				message: errorMessage,
			})
			return false
		}
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setFormIsSubmitting(true)
		const isValid = await validateRepository(values.gitRepository)
		if (!isValid) {
			setFormIsSubmitting(false)
			return
		}
		// Handle form submission
		try {
			const createdStackFromApi = await createStack({ data: values })
			console.log(createdStackFromApi)
			setCreatedStack(createdStackFromApi)
		} finally {
			setFormIsSubmitting(false)
		}
	}

	const inputDisabled = formIsSubmitting

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button size='sm' variant='outline'>
					Add New Stack
					<Plus className='ml-2 h-4 w-4' />
				</Button>
			</SheetTrigger>
			<SheetContent style={{ maxWidth: '33vw' }}>
				<SheetHeader>
					<SheetTitle>Deploy new Stack</SheetTitle>
					<SheetDescription>
						Enter the details for your new Stack.
					</SheetDescription>
				</SheetHeader>
				{createdStack ? (
					<div>
						<h1>Stack created</h1>
						<p>Stack ID: {createdStack.id}</p>
						<Link href={`/admin/stacks/${createdStack.id}`}>Go to Stack</Link>
					</div>
				) : (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							{form.formState.errors.gitRepository && (
								<div className='text-red-500'>
									{form.formState.errors.gitRepository.message}
								</div>
							)}
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem className='space-y-2'>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												disabled={inputDisabled}
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
													disabled={inputDisabled || isPending}
													autoComplete='off'
													onBlur={(e) => {
														field.onBlur()
														validateRepository(e.target.value)
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
												} // Update variant
												onClick={() => validateRepository(field.value)}
												disabled={inputDisabled || isPending}
											>
												{isPending ? (
													<Loader2 className='h-4 w-4 animate-spin' />
												) : form.formState.errors.gitRepository ? (
													<XCircle className='h-4 w-4 ' /> // Show red cross icon
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
							<FormField
								control={form.control}
								name='providerId'
								render={({ field }) => (
									<FormItem className='space-y-2'>
										<FormLabel>Provider</FormLabel>
										<FormControl>
											<Select
												disabled={inputDisabled}
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger>
													{field.value
														? providers?.github.find(
																(provider) => provider.id === field.value,
															)?.name
														: 'Select a provider'}
												</SelectTrigger>
												<SelectContent>
													{providers?.github.map((provider) => (
														<SelectItem key={provider.id} value={provider.id}>
															{provider.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='serverId'
								render={({ field }) => (
									<FormItem className='space-y-2'>
										<FormLabel>Server</FormLabel>
										<FormControl>
											<Select
												disabled={inputDisabled}
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger>
													{field.value
														? servers?.find(
																(server) => server.id === field.value,
															)?.name
														: 'Select a server'}
												</SelectTrigger>
												<SelectContent>
													{servers?.map((server) => (
														<SelectItem key={server.id} value={server.id}>
															{server.name} ({server.ipAddress})
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit' disabled={inputDisabled}>
								{formIsSubmitting && (
									<>
										<Loader2 className='h-4 w-4 animate-spin' />
									</>
								)}
								Add Stack
							</Button>
						</form>
					</Form>
				)}
			</SheetContent>
		</Sheet>
	)
}
