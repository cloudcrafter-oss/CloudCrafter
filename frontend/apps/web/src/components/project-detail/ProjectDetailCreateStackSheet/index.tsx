'use client'

import {
	usePostCreateStackHook,
	usePostValidateGithubRepoHook,
} from '@cloudcrafter/api'
import type { StackCreatedDto } from '@cloudcrafter/api'
import { createStackCommandCommandSchema } from '@cloudcrafter/api'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@cloudcrafter/ui/components/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'
import { PrivateRepositoryForm } from './PrivateRepositoryForm'
import { PublicRepositoryForm } from './PublicRepositoryForm'

const formSchema = createStackCommandCommandSchema

type RepositorySource = 'public' | 'private'
type WizardStep = 'source' | 'details'

export const ProjectDetailCreateStackSheet = ({
	environmentId,
}: { environmentId: string }) => {
	const [currentStep, setCurrentStep] = useState<WizardStep>('source')
	const [repositorySource, setRepositorySource] =
		useState<RepositorySource>('public')
	const [formIsSubmitting, setFormIsSubmitting] = useState(false)
	const [createdStack, setCreatedStack] = useState<StackCreatedDto | null>(null)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			gitRepository: 'https://github.com/cloudcrafter-oss/demo-examples',
			name: '',
			environmentId,
		},
	})

	const { mutateAsync, isPending } = usePostValidateGithubRepoHook()
	const { mutateAsync: createStack } = usePostCreateStackHook()

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
		try {
			const createdStackFromApi = await createStack({ data: values })
			setCreatedStack(createdStackFromApi)
		} finally {
			setFormIsSubmitting(false)
		}
	}

	const renderSourceStep = () => (
		<div className='space-y-6'>
			<div className='flex flex-col gap-4'>
				<Button
					type='button'
					variant={repositorySource === 'public' ? 'default' : 'outline'}
					className='w-full h-16 flex flex-row items-center justify-start px-4 space-x-4'
					onClick={() => setRepositorySource('public')}
				>
					<div className='text-xl'>🌐</div>
					<div className='font-semibold'>Public Repository</div>
				</Button>
				<Button
					type='button'
					variant={repositorySource === 'private' ? 'default' : 'outline'}
					className='w-full h-16 flex flex-row items-center justify-start px-4 space-x-4'
					onClick={() => setRepositorySource('private')}
				>
					<div className='text-xl'>🔒</div>
					<div className='font-semibold'>Private Repository</div>
				</Button>
			</div>
			<div className='text-sm text-muted-foreground text-center'>
				{repositorySource === 'public'
					? 'Use a public Git repository'
					: 'Connect to a private repository'}
			</div>
			<div className='flex justify-end'>
				<Button onClick={() => setCurrentStep('details')}>Continue</Button>
			</div>
		</div>
	)

	const renderDetailsStep = () => {
		const commonProps = {
			form,
			onSubmit,
			onBack: () => setCurrentStep('source'),
			inputDisabled: formIsSubmitting,
		}

		return repositorySource === 'public' ? (
			<PublicRepositoryForm
				{...commonProps}
				validateRepository={validateRepository}
				isPending={isPending}
			/>
		) : (
			<PrivateRepositoryForm {...commonProps} />
		)
	}

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
						{currentStep === 'source'
							? 'Choose your repository source'
							: 'Enter the details for your new Stack'}
					</SheetDescription>
				</SheetHeader>
				{createdStack ? (
					<div className='space-y-4'>
						<div className='flex items-center space-x-2 text-green-600'>
							<CheckCircle className='h-5 w-5' />
							<h2 className='text-lg font-semibold'>
								Stack created successfully
							</h2>
						</div>
						<p className='text-sm text-muted-foreground'>
							Stack ID: {createdStack.id}
						</p>
						<Button asChild>
							<Link href={`/admin/stacks/${createdStack.id}`}>Go to Stack</Link>
						</Button>
					</div>
				) : (
					<div className='mt-6'>
						{currentStep === 'source'
							? renderSourceStep()
							: renderDetailsStep()}
					</div>
				)}
			</SheetContent>
		</Sheet>
	)
}
