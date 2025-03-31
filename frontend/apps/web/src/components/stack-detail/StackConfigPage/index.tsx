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

	const activeSection_ = sections.find((s) => s.id === activeSection)

	return (
		<div className='flex flex-col md:flex-row h-full'>
			{/* Mobile Section Header */}
			<div className='md:hidden flex flex-col gap-1 p-4 pb-2 bg-background border-b'>
				<div className='flex items-center justify-between'>
					<h2 className='text-lg font-semibold'>{activeSection_?.title}</h2>
					<button
						type='button'
						className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					>
						<Menu className='h-5 w-5' />
						<span>Settings Menu</span>
					</button>
				</div>
				{/* Mobile SubTabs */}
				<div className='flex gap-2 overflow-x-auto py-1 -mx-4 px-4'>
					{activeSection_?.subTabs.map((subTab) => (
						<button
							key={subTab.id}
							type='button'
							onClick={() => {
								setActiveSubTab(subTab.id)
								updateHash(activeSection, subTab.id)
							}}
							className={cn(
								'flex items-center whitespace-nowrap rounded-full px-3 py-1 text-sm transition-colors',
								activeSubTab === subTab.id
									? 'bg-primary text-primary-foreground'
									: 'text-muted-foreground hover:text-foreground',
							)}
						>
							{subTab.title}
						</button>
					))}
				</div>
			</div>

			{/* Settings Sidebar */}
			<div
				className={cn(
					'fixed inset-0 z-50 md:relative md:z-0 md:w-72',
					'transition-all duration-200 ease-in-out',
					isSidebarOpen
						? 'opacity-100'
						: 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto',
				)}
			>
				{/* Backdrop for mobile */}
				<div
					className={cn(
						'absolute inset-0 bg-background/80 backdrop-blur-sm md:hidden',
						'transition-opacity duration-200',
						isSidebarOpen ? 'opacity-100' : 'opacity-0',
					)}
					onClick={() => setIsSidebarOpen(false)}
				/>

				{/* Sidebar Content */}
				<div
					className={cn(
						'fixed right-0 h-full w-[280px] bg-background border-l md:w-auto md:static md:border-l-0',
						'transition-transform duration-200 ease-in-out',
						'flex flex-col md:h-full',
						isSidebarOpen
							? 'translate-x-0'
							: 'translate-x-full md:translate-x-0',
					)}
				>
					<div className='flex items-center justify-between p-4 md:hidden border-b'>
						<h3 className='font-semibold'>Settings Navigation</h3>
						<button
							type='button'
							onClick={() => setIsSidebarOpen(false)}
							className='text-muted-foreground hover:text-foreground'
						>
							<X className='h-5 w-5' />
						</button>
					</div>

					<div className='flex-1 overflow-y-auto p-2 md:p-6 space-y-6'>
						{sections.map((section) => (
							<div key={section.id} className='w-full space-y-1'>
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
										'w-full justify-start text-left px-2 py-1.5 rounded-sm transition-colors text-base',
										'hover:text-foreground',
										activeSection === section.id
											? 'font-semibold text-foreground'
											: 'text-muted-foreground',
									)}
								>
									{section.title}
								</button>
								<div className='space-y-1'>
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
												'w-full justify-start text-left px-4 py-1.5 rounded-sm transition-colors text-sm',
												'hover:text-foreground',
												activeSection === section.id &&
													activeSubTab === subTab.id
													? 'font-medium text-foreground bg-accent/50'
													: 'text-muted-foreground',
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
			</div>

			{/* Content Area */}
			<div className='flex-1 overflow-auto md:p-6 md:border-l'>
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
