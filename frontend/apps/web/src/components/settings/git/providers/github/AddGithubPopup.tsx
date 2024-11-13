import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@ui/components/ui/dialog'
import { useState } from 'react'

export const GithubPopup: React.FC<{
	isOpen: boolean
	onOpenChange: (open: boolean) => void
}> = ({ isOpen, onOpenChange }) => {
	const [organisationName, setOrganisationName] = useState('')
	const [isOrganisation, setIsOrganisation] = useState(false)

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Connect to GitHub</DialogTitle>
				</DialogHeader>
				<div className='space-y-4'>
					<p className='text-sm text-gray-500'>
						Connect your GitHub account / organisation to enable repository
						access and collaboration features.
					</p>
					<div className='flex flex-col gap-2'>
						<label htmlFor='github-token' className='text-sm font-medium'>
							Personal Access Token
						</label>
						<input
							id='github-token'
							type='password'
							className='w-full px-3 py-2 border rounded-md'
							placeholder='ghp_xxxxxxxxxxxx'
						/>
						<p className='text-xs text-gray-400'>
							Generate a token with repo and user scopes from your GitHub
							settings
						</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
