'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@ui/components/ui/card'
import {} from '@ui/components/ui/tabs'
import { cn } from '@ui/lib/utils'
import type React from 'react'
import { useState, useEffect } from 'react'
import { BasicInfo } from '../general-settings/BasicInfo'
import { DummyInfoTab } from '../DummyInfoTab'
import type { StackDetailDto } from '@/src/core/__generated__'

// Define the base props interface
interface BaseComponentProps {
	stackDetails: StackDetailDto
}

// Update the sections structure
const sections = [
	{
		id: 'general',
		title: 'General Settings',
		description: 'Manage your general project settings',
		subTabs: [
			{
				id: 'basic',
				title: 'Basic Info',
				component: BasicInfo as React.ComponentType<BaseComponentProps>,
			},
			{
				id: 'advanced',
				title: 'Advanced Settings',
				component: DummyInfoTab as React.ComponentType<BaseComponentProps>,
			},
		],
	},
	{
		id: 'security',
		title: 'Security',
		description: 'Configure security options for your project',
		subTabs: [
			{ id: 'access', title: 'Access Control', component: DummyInfoTab },
			{ id: 'encryption', title: 'Encryption', component: DummyInfoTab },
		],
	},
	{
		id: 'integrations',
		title: 'Integrations',
		description: 'Manage third-party integrations',
		subTabs: [
			{ id: 'api', title: 'API Integrations', component: DummyInfoTab },
			{
				id: 'social',
				title: 'Social Media Integrations',
				component: DummyInfoTab,
			},
		],
	},
	{
		id: 'notifications',
		title: 'Notifications',
		description: 'Set up your notification preferences',
		subTabs: [
			{ id: 'email', title: 'Email Notifications', component: DummyInfoTab },
			{ id: 'sms', title: 'SMS Notifications', component: DummyInfoTab },
		],
	},
]

const StackConfigPage: React.FC<{ stackDetails: StackDetailDto }> = ({
	stackDetails,
}) => {
	const [activeSection, setActiveSection] = useState(sections[0].id)
	const [activeSubTab, setActiveSubTab] = useState(sections[0].subTabs[0].id)

	useEffect(() => {
		// Parse the hash on component mount and when it changes
		const handleHashChange = () => {
			const hash = window.location.hash.slice(1) // Remove the '#' character
			const [sectionId, subTabId] = hash.split('/')

			if (sectionId) {
				const section = sections.find((s) => s.id === sectionId)
				if (section) {
					setActiveSection(sectionId)
					if (subTabId && section.subTabs.some((st) => st.id === subTabId)) {
						setActiveSubTab(subTabId)
					} else {
						setActiveSubTab(section.subTabs[0].id)
					}
				}
			}
		}

		handleHashChange() // Handle initial hash
		window.addEventListener('hashchange', handleHashChange)
		return () => window.removeEventListener('hashchange', handleHashChange)
	}, [])

	const updateHash = (sectionId: string, subTabId: string) => {
		window.location.hash = `${sectionId}/${subTabId}`
	}

	return (
		<div className='flex h-screen'>
			{/* Sidebar */}
			<div className='w-64 h-full bg-slate-100 dark:bg-slate-800 flex flex-col items-start justify-start p-6 space-y-4 border-r'>
				{sections.map((section) => (
					<div key={section.id} className='w-full'>
						<button
							type='button'
							onClick={() => {
								const newSubTabId = section.subTabs[0].id
								setActiveSection(section.id)
								setActiveSubTab(newSubTabId)
								updateHash(section.id, newSubTabId)
							}}
							className={cn(
								'w-full justify-start text-left px-4 py-2 rounded-md transition-colors',
								'hover:bg-slate-200 dark:hover:bg-slate-700',
								activeSection === section.id
									? 'bg-primary text-primary-foreground font-semibold'
									: 'text-slate-700 dark:text-slate-300',
							)}
						>
							{section.title}
						</button>
						<div className='ml-4 mt-2 space-y-2'>
							{section.subTabs.map((subTab) => (
								<button
									type='button'
									key={subTab.id}
									onClick={() => {
										setActiveSubTab(subTab.id)
										updateHash(section.id, subTab.id)
									}}
									className={cn(
										'w-full justify-start text-left px-4 py-1 rounded-md transition-colors text-sm',
										'hover:bg-slate-200 dark:hover:bg-slate-700',
										activeSection === section.id && activeSubTab === subTab.id
											? 'bg-secondary text-secondary-foreground font-medium'
											: 'text-slate-600 dark:text-slate-400',
										activeSection !== section.id && 'hidden',
									)}
								>
									{subTab.title}
								</button>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Content Area */}
			<div className='flex-1 p-8 overflow-auto'>
				{sections.map((section) =>
					section.subTabs.map(
						(subTab) =>
							activeSection === section.id &&
							activeSubTab === subTab.id && (
								<Card key={`${section.id}-${subTab.id}`}>
									<CardHeader>
										<CardTitle>
											{section.title} - {subTab.title}
										</CardTitle>
										<CardDescription>{section.description}</CardDescription>
									</CardHeader>
									<CardContent>
										{subTab.component && (
											<subTab.component stackDetails={stackDetails} />
										)}
									</CardContent>
								</Card>
							),
					),
				)}
			</div>
		</div>
	)
}

export default StackConfigPage
