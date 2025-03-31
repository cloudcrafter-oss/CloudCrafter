'use client'

import { SourceSettings } from '@/src/components/stack-detail/source-settings'
import { useStackHub } from '@/src/hooks/useStackHub'
import type { StackDetailDto } from '@cloudcrafter/api'
import { cn } from '@cloudcrafter/ui/lib/utils'
import { Menu, X } from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'
import { DummyInfoTab } from '../DummyInfoTab'
import { DockerStorage } from '../docker-storage/DockerStorage'
import { EnvironmentVariables } from '../environment-variables/EnvironmentVariables'
import { VariableHistory } from '../environment-variables/VariableHistory'
import { VariableTemplates } from '../environment-variables/VariableTemplates'
import { BasicInfo } from '../general-settings/BasicInfo'
import { ServiceOverview } from '../service-overview'

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
				id: 'source',
				title: 'Source',
				component: SourceSettings as React.ComponentType<BaseComponentProps>,
			},
			{
				id: 'advanced',
				title: 'Advanced Settings',
				component: DummyInfoTab as React.ComponentType<BaseComponentProps>,
			},
		],
	},
	{
		id: 'environment',
		title: 'Environment Variables',
		testId: 'subsection-environment-variables',
		description: 'Manage environment variables for your stack',
		subTabs: [
			{
				id: 'variables',
				title: 'Variables',
				component:
					EnvironmentVariables as React.ComponentType<BaseComponentProps>,
			},
			{
				id: 'templates',
				title: 'Templates',
				component: VariableTemplates as React.ComponentType<BaseComponentProps>,
			},
			{
				id: 'history',
				title: 'History',
				component: VariableHistory as React.ComponentType<BaseComponentProps>,
			},
		],
	},
	{
		id: 'services',
		title: 'Services',
		description: 'Manage your services',
		subTabs: [
			{
				id: 'overview',
				title: 'Overview',
				component: ServiceOverview as React.ComponentType<BaseComponentProps>,
			},
			{
				id: 'storage',
				title: 'Docker Storage',
				component: DockerStorage as React.ComponentType<BaseComponentProps>,
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
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	const { stack } = useStackHub({ initialStack: stackDetails })

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
		<div className='flex flex-col md:flex-row h-full'>
			{/* Mobile Menu Button */}
			<button
				type='button'
				className='md:hidden flex items-center gap-2 p-4 text-sm font-medium'
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
			>
				<Menu className='h-5 w-5' />
				{sections.find((s) => s.id === activeSection)?.title || 'Menu'}
			</button>

			{/* Sidebar */}
			<div
				className={cn(
					'fixed inset-0 z-50 bg-background md:static md:block',
					'transition-transform duration-200 ease-in-out',
					isSidebarOpen
						? 'translate-x-0'
						: '-translate-x-full md:translate-x-0',
				)}
			>
				<div className='relative h-full w-64 bg-slate-100 dark:bg-slate-800 flex flex-col items-start justify-start p-4 space-y-2 border-r'>
					{/* Close button for mobile */}
					<button
						type='button'
						className='md:hidden absolute top-4 right-4'
						onClick={() => setIsSidebarOpen(false)}
					>
						<X className='h-5 w-5' />
					</button>

					{sections.map((section) => (
						<div key={section.id} className='w-full'>
							<button
								type='button'
								data-testid={section.testId}
								onClick={() => {
									const newSubTabId = section.subTabs[0].id
									setActiveSection(section.id)
									setActiveSubTab(newSubTabId)
									updateHash(section.id, newSubTabId)
									setIsSidebarOpen(false)
								}}
								className={cn(
									'w-full justify-start text-left px-3 py-2 rounded-md transition-colors text-sm',
									'hover:bg-slate-200 dark:hover:bg-slate-700',
									activeSection === section.id
										? 'bg-primary text-primary-foreground font-semibold'
										: 'text-slate-700 dark:text-slate-300',
								)}
							>
								{section.title}
							</button>
							<div className='ml-3 mt-1 space-y-1'>
								{section.subTabs.map((subTab) => (
									<button
										type='button'
										key={subTab.id}
										onClick={() => {
											setActiveSubTab(subTab.id)
											updateHash(section.id, subTab.id)
											setIsSidebarOpen(false)
										}}
										className={cn(
											'w-full justify-start text-left px-3 py-1.5 rounded-md transition-colors text-sm',
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
			</div>

			{/* Content Area */}
			<div className='flex-1 p-4 overflow-auto'>
				{sections.map((section) =>
					section.subTabs.map(
						(subTab) =>
							activeSection === section.id &&
							activeSubTab === subTab.id && (
								<div key={`${section.id}-${subTab.id}`}>
									{subTab.component && (
										<subTab.component stackDetails={stack} />
									)}
								</div>
							),
					),
				)}
			</div>
		</div>
	)
}

export default StackConfigPage
