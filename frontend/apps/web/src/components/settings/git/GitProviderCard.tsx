'use client'
import { Button } from '@cloudcrafter/ui/components/button'
import { Card } from '@cloudcrafter/ui/components/card'
import type React from 'react'
import { useState } from 'react'

type BaseGitProvider = {
	id: string
	name: 'GitHub' | 'GitLab' | 'Bitbucket'
	connected: boolean
	icon: React.ReactNode
}

type GitProviderWithPopup = BaseGitProvider & {
	hasPopup: true
	PopupComponent: React.ComponentType<{
		isOpen: boolean
		onOpenChange: (open: boolean) => void
	}>
}

type GitProviderWithoutPopup = BaseGitProvider & {
	hasPopup: false
}

export type GitProvider = GitProviderWithPopup | GitProviderWithoutPopup

export const GitProviderCard = ({ provider }: { provider: GitProvider }) => {
	const [isOpen, setIsOpen] = useState(false)

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open)
	}

	const handleClick = () => {
		if (provider.connected) {
			// Handle disconnect logic
			console.log(`Disconnecting from ${provider.name}`)
		} else if (provider.hasPopup) {
			setIsOpen(true)
		} else {
			// Handle direct connection for providers without popups
			console.log(`Connecting to ${provider.name}`)
		}
	}
	return (
		<Card className='p-6'>
			{/* Render popup if provider has one */}
			{provider.hasPopup && (
				<provider.PopupComponent
					isOpen={isOpen}
					onOpenChange={handleOpenChange}
				/>
			)}

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
				onClick={handleClick}
			>
				{provider.connected ? 'Disconnect' : 'Connect'}
			</Button>
		</Card>
	)
}
