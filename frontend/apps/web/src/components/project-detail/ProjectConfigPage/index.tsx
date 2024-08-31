'use client'

import type React from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@ui/components/ui/card'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@ui/components/ui/tabs'
import { cn } from '@ui/lib/utils'

// Define the content sections
const sections = [
	{
		id: 'general',
		title: 'General Settings',
		description: 'Manage your general project settings',
	},
	{
		id: 'security',
		title: 'Security',
		description: 'Configure security options for your project',
	},
	{
		id: 'integrations',
		title: 'Integrations',
		description: 'Manage third-party integrations',
	},
	{
		id: 'notifications',
		title: 'Notifications',
		description: 'Set up your notification preferences',
	},
]

const ProjectConfigPage: React.FC = () => {
	return (
		<Tabs
			defaultValue={sections[0].id}
			className='w-full'
			orientation='vertical'
		>
			<div className='flex h-screen'>
				{/* Sidebar */}
				<TabsList className='w-64 h-full bg-slate-100 dark:bg-slate-800 flex flex-col items-start justify-start p-6 space-y-4 border-r'>
					{' '}
					{sections.map((section) => (
						<TabsTrigger
							key={section.id}
							value={section.id}
							className={cn(
								'w-full justify-start text-left px-4 py-2 rounded-md transition-colors',
								'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
								'hover:bg-slate-200 dark:hover:bg-slate-700',
							)}
						>
							{section.title}
						</TabsTrigger>
					))}
				</TabsList>

				{/* Content Area */}
				<div className='flex-1 p-8 overflow-auto'>
					{sections.map((section) => (
						<TabsContent key={section.id} value={section.id}>
							<Card>
								<CardHeader>
									<CardTitle>{section.title}</CardTitle>
									<CardDescription>{section.description}</CardDescription>
								</CardHeader>
								<CardContent>
									{/* Replace this with your actual content for each section */}
									<p>Content for {section.title} goes here.</p>
								</CardContent>
							</Card>
						</TabsContent>
					))}
				</div>
			</div>
		</Tabs>
	)
}

export default ProjectConfigPage
