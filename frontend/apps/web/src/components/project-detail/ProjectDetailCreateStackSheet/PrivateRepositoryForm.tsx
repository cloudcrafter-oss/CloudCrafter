import {
	type SourceProviderDto,
	type StackCreatedDto,
	createStackFromSourceProviderCommandCommandSchema,
	useGetProvidersHook,
	usePostCreateStackFromSourceProviderHook,
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
import { cn } from '@cloudcrafter/ui/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { GithubIcon, GitlabIcon, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'
import { GitBranchesList } from './private-repo/git-branches-list'
import { GitRepositoriesList } from './private-repo/git-repositories-list'

interface PrivateRepositoryFormProps {
	environmentId: string
	onBack: () => void
	onStackCreated: (stack: StackCreatedDto) => void
}

const ProviderButton = ({
	provider,
	onClick,
	disabled,
}: {
	provider: SourceProviderDto
	onClick: () => void
	disabled: boolean
}) => {
	const iconMap = {
		github: <GithubIcon />,
		gitlab: <GitlabIcon />,
	}
	return (
		<Button
			type='button'
			variant='outline'
			className={cn(
				'flex-1',
				provider.name.toLowerCase() === 'github' &&
					'hover:bg-[#2da44e]/10 hover:border-[#2da44e]',
				provider.name.toLowerCase() === 'gitlab' &&
					'hover:bg-[#E24329]/10 hover:border-[#E24329]',
			)}
			onClick={onClick}
			disabled={disabled}
		>
			{iconMap[provider.type.toLowerCase() as keyof typeof iconMap]}
			{provider.name}
		</Button>
	)
}

export const PrivateRepositoryForm = ({
	environmentId,
	onBack,
	onStackCreated,
}: PrivateRepositoryFormProps) => {
	const [formIsSubmitting, setFormIsSubmitting] = useState(false)
	const form = useForm<
		z.infer<typeof createStackFromSourceProviderCommandCommandSchema>
	>({
		resolver: zodResolver(createStackFromSourceProviderCommandCommandSchema),
		defaultValues: {
			name: '',
			environmentId,
		},
	})

	const { mutateAsync: createStack } =
		usePostCreateStackFromSourceProviderHook()
	const { data: providers, isLoading: isLoadingProviders } =
		useGetProvidersHook({
			IsActive: true,
		})

	const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
	const [selectedRepositoryId, setSelectedRepositoryId] = useState<string>('')
	const [selectedBranchName, setSelectedBranchName] = useState<string>('')

	const onSubmit = async (
		values: z.infer<typeof createStackFromSourceProviderCommandCommandSchema>,
	) => {
		try {
			setFormIsSubmitting(true)
			const createdStackFromApi = await createStack({
				data: values,
			})
			onStackCreated(createdStackFromApi)
		} finally {
			setFormIsSubmitting(false)
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: run when selectedRepositoryId changes
	useEffect(() => {
		setSelectedBranchName('')
		form.setValue('branch', '')
	}, [selectedRepositoryId, form.setValue])

	useEffect(() => {
		if (selectedProvider) {
			form.setValue('providerId', selectedProvider)
		}
	}, [selectedProvider, form.setValue])

	if (!selectedProvider) {
		return (
			<div className='space-y-4'>
				<div className='space-y-2'>
					<h2 className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
						Select Provider
					</h2>
					<div className='flex gap-2'>
						{isLoadingProviders ? (
							<div className='w-full flex justify-center'>
								<Loader2 className='h-4 w-4 animate-spin' />
							</div>
						) : (
							providers?.map((provider) => (
								<ProviderButton
									key={provider.id}
									provider={provider}
									onClick={() => setSelectedProvider(provider.id)}
									disabled={formIsSubmitting}
								/>
							))
						)}
					</div>
				</div>
				<div className='flex justify-between'>
					<Button type='button' variant='outline' onClick={onBack}>
						Back
					</Button>
				</div>
			</div>
		)
	}

	const formValues = form.watch()

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

				<GitRepositoriesList
					providerId={selectedProvider}
					selectedRepositoryId={selectedRepositoryId}
					onRepositorySelect={(id, name) => {
						setSelectedRepositoryId(id)
						form.setValue('repositoryId', id)
						form.setValue('repository', name)
					}}
				/>

				{selectedRepositoryId.length > 0 && (
					<GitBranchesList
						providerId={selectedProvider}
						repositoryId={selectedRepositoryId}
						selectedBranchName={selectedBranchName}
						setSelectedBranchName={(branch) => {
							setSelectedBranchName(branch)
							form.setValue('branch', branch)
						}}
					/>
				)}

				{/* <ServerSelect form={form} inputDisabled={formIsSubmitting} /> */}

				<div className='space-y-2 rounded-md bg-slate-950 p-4 text-xs text-slate-50'>
					<pre>Form Values: {JSON.stringify(formValues, null, 2)}</pre>
					<pre>
						Form Errors: {JSON.stringify(form.formState.errors, null, 2)}
					</pre>
					<pre>Selected Provider: {selectedProvider}</pre>
					<pre>Selected Repository: {selectedRepositoryId}</pre>
					<pre>Selected Branch: {selectedBranchName}</pre>
					<pre>Is Submitting: {String(formIsSubmitting)}</pre>
					<pre>Is Form Valid: {String(form.formState.isValid)}</pre>
				</div>

				<div className='flex justify-between'>
					<Button
						type='button'
						variant='outline'
						onClick={() => {
							setSelectedProvider(null)
							onBack()
						}}
					>
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
