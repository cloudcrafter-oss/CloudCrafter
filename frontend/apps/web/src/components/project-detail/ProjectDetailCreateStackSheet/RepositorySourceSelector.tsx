import { Button } from '@cloudcrafter/ui/components/button'

type RepositorySource = 'public' | 'private'

interface RepositorySourceSelectorProps {
	selectedSource: RepositorySource
	onSourceSelect: (source: RepositorySource) => void
	onContinue: () => void
}

export const RepositorySourceSelector = ({
	selectedSource,
	onSourceSelect,
	onContinue,
}: RepositorySourceSelectorProps) => {
	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-4'>
				<Button
					type='button'
					variant={selectedSource === 'public' ? 'default' : 'outline'}
					className='w-full h-16 flex flex-row items-center justify-start px-4 space-x-4'
					onClick={() => onSourceSelect('public')}
				>
					<div className='text-xl'>🌐</div>
					<div className='font-semibold'>Public Repository</div>
				</Button>
				<Button
					type='button'
					variant={selectedSource === 'private' ? 'default' : 'outline'}
					className='w-full h-16 flex flex-row items-center justify-start px-4 space-x-4'
					onClick={() => onSourceSelect('private')}
				>
					<div className='text-xl'>🔒</div>
					<div className='font-semibold'>Private Repository</div>
				</Button>
			</div>
			<div className='text-sm text-muted-foreground text-center'>
				{selectedSource === 'public'
					? 'Use a public Git repository'
					: 'Connect to a private repository'}
			</div>
			<div className='flex justify-end'>
				<Button onClick={onContinue}>Continue</Button>
			</div>
		</div>
	)
}
