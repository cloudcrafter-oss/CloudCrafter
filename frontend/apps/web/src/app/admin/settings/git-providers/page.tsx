import { SiBitbucket, SiGithub, SiGitlab } from '@icons-pack/react-simple-icons'
import { Button } from '@ui/components/ui/button'
import { Card } from '@ui/components/ui/card'
import { Plus } from 'lucide-react'
import type React from 'react'

interface GitProvider {
	id: string
	name: 'GitHub' | 'GitLab' | 'Bitbucket'
	connected: boolean
	icon: React.ReactNode
}

export default function GitProvidersPage() {
	const providers: GitProvider[] = [
		{
			id: 'github',
			name: 'GitHub',
			connected: false,
			icon: <SiGithub />,
		},
		{
			id: 'gitlab',
			name: 'GitLab',
			connected: false,
			icon: <SiGitlab />,
		},
		{
			id: 'bitbucket',
			name: 'Bitbucket',
			connected: false,
			icon: <SiBitbucket />,
		},
	]

	return (
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
					<Card key={provider.id} className='p-6'>
						<div className='flex items-center space-x-4'>
							<div className='w-12 h-12 relative flex items-center justify-center'>
								{provider.icon}
							</div>
							<div>
								<h3 className='font-semibold'>{provider.name}</h3>
								<p className='text-sm text-gray-500'>
									{provider.connected ? 'Connected' : 'Not connected'}
								</p>
							</div>
						</div>
						<Button
							variant={provider.connected ? 'destructive' : 'secondary'}
							className='w-full mt-4'
						>
							{provider.connected ? 'Disconnect' : 'Connect'}
						</Button>
					</Card>
				))}
			</div>
		</div>
	)
}
