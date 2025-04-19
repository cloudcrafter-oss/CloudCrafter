'use client'

import { SourceSettings } from '@/src/components/stack-detail/source-settings'
import { useStackHub } from '@/src/hooks/useStackHub'
import type { StackDetailDto } from '@cloudcrafter/api'
import { useGetDeploymentsForStackHook } from '@cloudcrafter/api'
import { Card, CardContent } from '@cloudcrafter/ui/components/card'
import { cn } from '@cloudcrafter/ui/lib/utils'
import { ChevronDown, Menu, X } from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'
import { DummyInfoTab } from '../DummyInfoTab'
import { DeploymentList } from '../deployments/deployment-list'
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
		id: 'deployments',
		title: 'Deployments',
		testId: 'subsection-deployments',
		description: 'View and manage stack deployments',
		subTabs: [
			{
				id: 'list',
				title: 'Deployment List',
				component: ({ stackDetails }: BaseComponentProps) => {
					const { data: deployments = [] } = useGetDeploymentsForStackHook(
						stackDetails.id,
					)
					return <DeploymentList deployments={deployments} />
				},
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
		testId: 'subsection-services',
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
	const [expandedSections, setExpandedSections] = useState<string[]>([
		sections[0].id,
	])

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

	const toggleSection = (sectionId: string) => {
		setExpandedSections((prev) =>
			prev.includes(sectionId)
				? prev.filter((id) => id !== sectionId)
				: [...prev, sectionId],
		)
	}

	const activeSection_ = sections.find((s) => s.id === activeSection)

	return (
		<div className='flex flex-col md:flex-row min-h-0 max-w-[100vw]'>
			{/* Mobile Section Header */}
			<div className='md:hidden flex flex-col gap-1 p-4 pb-2 bg-background border-b max-w-full'>
				<div className='flex items-center justify-between max-w-full'>
					<h2 className='text-lg font-semibold truncate flex-1 mr-2'>
						{activeSection_?.title}
					</h2>
					<button
						type='button'
						className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground shrink-0'
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					>
						<Menu className='h-5 w-5' />
						<span className='sr-only md:not-sr-only'>Settings Menu</span>
					</button>
				</div>
				{/* Mobile SubTabs */}
				<div className='flex gap-2 overflow-x-auto py-1 -mx-4 px-4 scrollbar-none'>
					{activeSection_?.subTabs.map((subTab) => (
						<button
							key={subTab.id}
							type='button'
							onClick={() => {
								setActiveSubTab(subTab.id)
								updateHash(activeSection, subTab.id)
							}}
							className={cn(
								'flex items-center whitespace-nowrap rounded-full px-3 py-1 text-sm transition-colors shrink-0',
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
					'fixed inset-0 z-50 md:relative md:z-0 md:w-80',
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
				<Card
					className={cn(
						'fixed right-0 h-full w-[min(320px,100vw-4rem)] md:w-auto md:static',
						'transition-transform duration-200 ease-in-out',
						'flex flex-col md:h-full overflow-hidden',
						isSidebarOpen
							? 'translate-x-0'
							: 'translate-x-full md:translate-x-0',
					)}
				>
					<div className='flex items-center justify-between p-4 md:hidden border-b'>
						<h3 className='font-semibold truncate'>Settings Navigation</h3>
						<button
							type='button'
							onClick={() => setIsSidebarOpen(false)}
							className='text-muted-foreground hover:text-foreground ml-2'
						>
							<X className='h-5 w-5' />
						</button>
					</div>

					<CardContent className='flex-1 overflow-y-auto overflow-x-hidden p-2 md:p-6 space-y-2'>
						{sections.map((section) => (
							<div key={section.id} className='w-full'>
								<button
									type='button'
									data-testid={section.testId}
									onClick={() => {
										if (activeSection === section.id) {
											toggleSection(section.id)
										} else {
											const newSubTabId = section.subTabs[0].id
											setActiveSection(section.id)
											setActiveSubTab(newSubTabId)
											updateHash(section.id, newSubTabId)
											setIsSidebarOpen(false)
											if (!expandedSections.includes(section.id)) {
												toggleSection(section.id)
											}
										}
									}}
									className={cn(
										'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-sm group',
										'hover:bg-accent/50 hover:shadow-sm',
										activeSection === section.id
											? 'bg-gradient-to-r from-primary/10 to-accent/20 text-foreground font-medium shadow-sm'
											: 'text-muted-foreground hover:text-foreground',
									)}
								>
									<span className='truncate font-medium'>{section.title}</span>
									<ChevronDown
										className={cn(
											'h-4 w-4 text-muted-foreground/70 transition-transform duration-300',
											expandedSections.includes(section.id) && 'rotate-180',
											'group-hover:text-foreground',
										)}
									/>
								</button>
								<div
									className={cn(
										'overflow-hidden transition-all duration-300 space-y-0.5 pl-2',
										expandedSections.includes(section.id)
											? 'max-h-48 opacity-100 mt-1'
											: 'max-h-0 opacity-0',
									)}
								>
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
												'w-full flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm',
												'hover:bg-accent/40',
												activeSection === section.id &&
													activeSubTab === subTab.id
													? 'bg-accent/30 text-foreground font-medium shadow-sm'
													: 'text-muted-foreground hover:text-foreground',
												'relative overflow-hidden',
												activeSection === section.id &&
													activeSubTab === subTab.id &&
													'after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-6 after:bg-primary after:rounded-r-full',
											)}
										>
											<span className='truncate ml-1'>{subTab.title}</span>
										</button>
									))}
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Content Area */}
			<div className='flex-1 min-w-0 overflow-y-auto overflow-x-hidden'>
				<div className='w-full max-w-full pt-0 md:pt-0 p-4 md:p-6 md:border-l'>
					{sections.map((section) =>
						section.subTabs.map(
							(subTab) =>
								activeSection === section.id &&
								activeSubTab === subTab.id && (
									<div
										key={`${section.id}-${subTab.id}`}
										className='min-w-0 max-w-full'
									>
										{subTab.component && (
											<subTab.component stackDetails={stack} />
										)}
									</div>
								),
						),
					)}
				</div>
			</div>
		</div>
	)
}

export default StackConfigPage
