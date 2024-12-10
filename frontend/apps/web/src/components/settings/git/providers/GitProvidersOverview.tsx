'use client'
import {
	type GitProvider,
	GitProviderCard,
} from '@/src/components/settings/git/GitProviderCard'
import { BitbucketPopup } from '@/src/components/settings/git/providers/bitbucket/AddBitbucketPopup'
import { GithubPopup } from '@/src/components/settings/git/providers/github/AddGithubPopup'
import { GitlabPopup } from '@/src/components/settings/git/providers/gitlab/AddGitlabPopup'
import { formatDate } from '@/src/utils/date/date-utils'
import {
	type SimpleGithubProviderDto,
	type SourceProviderDto,
	useDeleteProviderHook,
} from '@cloudcrafter/api'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@cloudcrafter/ui/components/alert-dialog'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@cloudcrafter/ui/components/dialog'
import { SiBitbucket, SiGithub, SiGitlab } from '@icons-pack/react-simple-icons'
import { Plus, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export const GitProvidersOverview = ({
	list,
}: { list: SourceProviderDto[] }) => {
	const searchParams = useSearchParams()
	const [messagePopupContents, setMessagePopupContents] = useState<
		string | null
	>(null)

	useEffect(() => {
		if (searchParams.get('message') === 'github_added') {
			setMessagePopupContents(
				'Git provider connected successfully. In order to use this provider, you need to install it onto your acount. Press the "Install" button to install the provider.',
			)
		}
		if (searchParams.get('message') === 'github_installed') {
			setMessagePopupContents('Github provider installed successfully!')
		}
	}, [searchParams])

	useEffect(() => {
		if (messagePopupContents === null) {
			const url = new URL(window.location.href)
			url.searchParams.delete('message')
			window.history.replaceState({}, '', url)
		}
	}, [messagePopupContents])

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
			<Dialog
				open={messagePopupContents !== null}
				onOpenChange={(open) => setMessagePopupContents(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Success!</DialogTitle>
					</DialogHeader>
					<p>{messagePopupContents}</p>
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
					<h2 className='text-xl font-semibold mb-4'>Connected Providers</h2>
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow'>
						{list && list.length > 0 ? (
							<ul className='divide-y divide-gray-200 dark:divide-gray-700'>
								{list.map((provider) => {
									if (provider.github != null) {
										return (
											<GithubRow
												sourceProvider={provider}
												key={provider.id}
												provider={provider.github}
											/>
										)
									}
									return null
								})}
							</ul>
						) : (
							<div className='p-4 text-center text-gray-500 dark:text-gray-400'>
								No providers connected
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

const GithubRow = ({
	provider,
	sourceProvider,
}: {
	provider: SimpleGithubProviderDto
	sourceProvider: SourceProviderDto
}) => {
	const [showDeleteAlert, setShowDeleteAlert] = useState(false)

	const deleteMutation = useDeleteProviderHook({
		mutation: {
			onSuccess: () => {
				setShowDeleteAlert(false)
				revalidatePath('/admin/settings/git-providers')
			},
		},
	})

	if (provider == null) {
		return null
	}

	const handleDelete = () => {
		deleteMutation.mutate({
			id: sourceProvider.id,
		})
	}

	return (
		<>
			<AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the Git provider "{provider.name}".
							This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<li key={provider.id} className='p-4 flex items-center justify-between'>
				<div className='flex items-center space-x-3'>
					<SiGithub className='w-5 h-5 text-gray-700 dark:text-gray-300' />
					<div className='flex flex-col'>
						<span className='font-medium dark:text-gray-200'>
							{provider.name}
						</span>
						<span className='text-sm text-gray-500 dark:text-gray-400'>
							Added {formatDate(provider.createdAt, 'MMMM d, yyyy HH:mm')}
						</span>
					</div>
				</div>
				<div className='flex items-center gap-4'>
					<span
						className={`text-sm ${provider.isConnected === true ? 'text-green-500 dark:text-green-400' : provider.isConnected === false ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
					>
						{provider.isConnected === true
							? 'Connected'
							: provider.isConnected === false
								? 'Not connected'
								: 'Unknown'}
					</span>
					{!provider.hasInstallation &&
						provider.appUrl &&
						provider.appUrl.length > 0 && (
							<Link
								href={`${provider.appUrl}/installations/new?state=github_install:${sourceProvider.id}`}
							>
								<Button size='sm' variant='outline'>
									Install
								</Button>
							</Link>
						)}
					<Button
						size='sm'
						variant='destructive'
						onClick={() => setShowDeleteAlert(true)}
					>
						<Trash2 className='h-4 w-4' />
					</Button>
				</div>
			</li>
		</>
	)
}
