import { Alert, AlertDescription, AlertTitle } from '@ui/components/ui/alert'
import { Button } from '@ui/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@ui/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@ui/components/ui/dialog'
import { Input } from '@ui/components/ui/input'
import { Label } from '@ui/components/ui/label'
import { Switch } from '@ui/components/ui/switch'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@ui/components/ui/tabs'
import { format } from 'date-fns'
import { ArrowRight, Github } from 'lucide-react'
import { useState } from 'react'

export const GithubPopup: React.FC<{
	isOpen: boolean
	onOpenChange: (open: boolean) => void
}> = ({ isOpen, onOpenChange }) => {
	const [activeTab, setActiveTab] = useState('guide')
	const [appId, setAppId] = useState('')
	const [privateKey, setPrivateKey] = useState('')
	const [webhookSecret, setWebhookSecret] = useState('')

	const [isOrganization, setIsOrganization] = useState(false)
	const [organizationName, setOrganizationName] = useState('')

	const handleConnect = async (e: React.FormEvent) => {
		e.preventDefault()
		// Implement your connection logic here
		console.log({ appId, privateKey, webhookSecret })
		onOpenChange(false)
	}

	const manifest = JSON.stringify({
		redirect_url: `${origin}/api/git-providers/github/setup?authId=some-data`,
		name: `CloudCrafter-${format(new Date(), 'yyyy-MM-dd')}`,
		url: origin,
		hook_attributes: {
			url: `${origin}/api/git-providers/github/webhook`,
		},
		callback_urls: [`${origin}/api/git-providers/github/setup`],
		public: false,
		request_oauth_on_install: true,
		default_permissions: {
			contents: 'read',
			metadata: 'read',
			emails: 'read',
			pull_requests: 'write',
		},
		default_events: ['pull_request', 'push'],
	})

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Connect to GitHub</DialogTitle>
				</DialogHeader>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='guide'>Setup Guide</TabsTrigger>
						<TabsTrigger value='connect'>Connect App</TabsTrigger>
					</TabsList>

					<TabsContent value='guide' className='space-y-4'>
						<Alert>
							<AlertTitle className='flex items-center gap-2'>
								<Github className='w-4 h-4' />
								GitHub App Setup Instructions
							</AlertTitle>
							<AlertDescription>
								Follow these steps to create and configure your GitHub App!
							</AlertDescription>
						</Alert>
						<form
							action={
								isOrganization
									? `https://github.com/organizations/${organizationName}/settings/apps/new?state=gh_init:some-data`
									: 'https://github.com/settings/apps/new?state=gh_init:some-data'
							}
							method='post'
						>
							<input type='hidden' name='manifest' value={manifest} />
							<div className='space-y-4'>
								<Card>
									<CardHeader>
										<CardTitle className='text-base'>
											1. Should the app access an organisation?
										</CardTitle>
										<CardDescription>
											If the app should access an organisation, enter the
											organisation name below.
										</CardDescription>
									</CardHeader>
									<CardContent className='space-y-2'>
										<div className='space-y-2'>
											<div className='flex items-center space-x-2'>
												<Switch
													id='org-mode'
													checked={isOrganization}
													onCheckedChange={setIsOrganization}
												/>
												<Label htmlFor='org-mode'>
													Yes, this should be an organization app
												</Label>
											</div>

											{isOrganization && (
												<div className='space-y-1'>
													<Label htmlFor='org-name'>Organization Name</Label>
													<Input
														id='org-name'
														placeholder='Enter organization name'
														value={organizationName}
														onChange={(e) =>
															setOrganizationName(e.target.value)
														}
													/>
												</div>
											)}
										</div>
									</CardContent>
								</Card>

								<Button className='w-full' type='submit'>
									Create Github Application
									<ArrowRight className='w-4 h-4 ml-2' />
								</Button>
							</div>
						</form>
					</TabsContent>

					<TabsContent value='connect'>
						<form onSubmit={handleConnect} className='space-y-4'>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<label className='text-sm font-medium'>GitHub App ID</label>
									<Input
										placeholder='Enter App ID'
										value={appId}
										onChange={(e) => setAppId(e.target.value)}
										required
									/>
								</div>

								<div className='space-y-2'>
									<label className='text-sm font-medium'>Private Key</label>
									<Input
										placeholder='Paste your private key'
										value={privateKey}
										onChange={(e) => setPrivateKey(e.target.value)}
										required
									/>
									<p className='text-xs text-gray-500'>
										You can generate this in your GitHub App settings
									</p>
								</div>

								<div className='space-y-2'>
									<label className='text-sm font-medium'>Webhook Secret</label>
									<Input
										placeholder='Enter webhook secret'
										value={webhookSecret}
										onChange={(e) => setWebhookSecret(e.target.value)}
										required
									/>
								</div>
							</div>

							<div className='flex gap-2 pt-4'>
								<Button
									type='button'
									variant='outline'
									onClick={() => setActiveTab('guide')}
								>
									Back to Guide
								</Button>
								<Button type='submit' className='flex-1'>
									Connect GitHub App
								</Button>
							</div>
						</form>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}
