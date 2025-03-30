'use client'

import type { StackCreatedDto } from '@cloudcrafter/api'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@cloudcrafter/ui/components/sheet'
import { CheckCircle, Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { PrivateRepositoryForm } from './PrivateRepositoryForm'
import { PublicRepositoryForm } from './PublicRepositoryForm'
import { RepositorySourceSelector } from './RepositorySourceSelector'

type RepositorySource = 'public' | 'private'
type WizardStep = 'source' | 'details'

export const ProjectDetailCreateStackSheet = ({
	environmentId,
	projectId,
}: {
	environmentId: string
	projectId: string
}) => {
	const [currentStep, setCurrentStep] = useState<WizardStep>('source')
	const [repositorySource, setRepositorySource] =
		useState<RepositorySource>('public')
	const [createdStack, setCreatedStack] = useState<StackCreatedDto | null>(null)

	const handleContinue = () => setCurrentStep('details')
	const handleBack = () => setCurrentStep('source')

	const renderContent = () => {
		if (createdStack) {
			return (
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
						<Link
							data-testid='btn-go-to-stack'
							href={`/admin/projects/${projectId}/${environmentId}/stack/${createdStack.id}`}
						>
							Go to Stack
						</Link>
					</Button>
				</div>
			)
		}

		if (currentStep === 'source') {
			return (
				<RepositorySourceSelector
					selectedSource={repositorySource}
					onSourceSelect={setRepositorySource}
					onContinue={handleContinue}
				/>
			)
		}

		return repositorySource === 'public' ? (
			<PublicRepositoryForm
				environmentId={environmentId}
				onBack={handleBack}
				onStackCreated={setCreatedStack}
			/>
		) : (
			<PrivateRepositoryForm
				environmentId={environmentId}
				onBack={handleBack}
				onStackCreated={setCreatedStack}
			/>
		)
	}

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button data-testid='btn-create-stack' size='sm' variant='outline'>
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
				<div className='mt-6'>{renderContent()}</div>
			</SheetContent>
		</Sheet>
	)
}
