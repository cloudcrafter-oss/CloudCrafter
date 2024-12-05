'use client'
import {
	type GitProvider,
	GitProviderCard,
} from '@/src/components/settings/git/GitProviderCard'
import { BitbucketPopup } from '@/src/components/settings/git/providers/bitbucket/AddBitbucketPopup'
import { GithubPopup } from '@/src/components/settings/git/providers/github/AddGithubPopup'
import { GitlabPopup } from '@/src/components/settings/git/providers/gitlab/AddGitlabPopup'
import { formatDate } from '@/src/utils/date/date-utils'
import type { ProviderOverviewDto } from '@cloudcrafter/api'
import { SiBitbucket, SiGithub, SiGitlab } from '@icons-pack/react-simple-icons'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@cloudcrafter/ui/components/dialog'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export const GitProvidersOverview = ({
	list,
}: { list: ProviderOverviewDto }) => {
	const searchParams = useSearchParams()
	const [showSuccessPopup, setShowSuccessPopup] = useState(false)

	useEffect(() => {
		if (searchParams.get('message') === 'success') {
			setShowSuccessPopup(true)
		}
	}, [searchParams])

	// Example providers configuration
	const providers: GitProvider[] = [
		{
			id: 'github',
			name: 'GitHub',
			connected: false,
			icon: <SiGithub />,
			hasPopup: true,
			PopupComponent: GithubPopup,
		},
		{
			id: 'gitlab',
			name: 'GitLab',
			connected: false,
			icon: <SiGitlab />,
			hasPopup: true,
			PopupComponent: GitlabPopup,
		},
		{
			id: 'bitbucket',
			name: 'Bitbucket',
			connected: false,
			icon: <SiBitbucket />,
			hasPopup: true,
			PopupComponent: BitbucketPopup,
		},
	]

	return (
		<>
			<Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Success!</DialogTitle>
					</DialogHeader>
					<p>Git provider connected successfully</p>
				</DialogContent>
			</Dialog>

			<div className='container mx-auto py-8'>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-2xl font-bold'>Git Providers</h1>
					<Button>
						<Plus className='w-4 h-4 mr-2' />
						Add Provider
					</Button>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{providers.map((provider) => (
						<GitProviderCard key={provider.id} provider={provider} />
					))}
				</div>

				<div className='mt-8'>
					<h2 className='text-xl font-semibold mb-4'>
						Connected GitHub Providers
					</h2>
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow'>
						{list.github && list.github.length > 0 ? (
							<ul className='divide-y divide-gray-200 dark:divide-gray-700'>
								{list.github.map((provider) => (
									<li
										key={provider.id}
										className='p-4 flex items-center justify-between'
									>
										<div className='flex items-center space-x-3'>
											<SiGithub className='w-5 h-5 text-gray-700 dark:text-gray-300' />
											<div className='flex flex-col'>
												<span className='font-medium dark:text-gray-200'>
													{provider.name}
												</span>
												<span className='text-sm text-gray-500 dark:text-gray-400'>
													Added{' '}
													{formatDate(provider.createdAt, 'MMMM d, yyyy HH:mm')}
												</span>
											</div>
										</div>
										<span
											className={`text-sm ${provider.isConnected === true ? 'text-green-500 dark:text-green-400' : provider.isConnected === false ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
										>
											{provider.isConnected === true
												? 'Connected'
												: provider.isConnected === false
													? 'Not connected'
													: 'Unknown'}
										</span>
									</li>
								))}
							</ul>
						) : (
							<div className='p-4 text-center text-gray-500 dark:text-gray-400'>
								No GitHub providers connected
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
