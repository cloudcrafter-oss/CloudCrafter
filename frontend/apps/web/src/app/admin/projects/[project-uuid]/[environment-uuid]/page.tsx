import { EnvironmentBadge } from '@/src/components/EnvironmentBadge'
import ShowDate from '@/src/components/ShowDate'
import { StackCard } from '@/src/components/Stacks/StackCard'
import { ProjectDetailCreateStackSheet } from '@/src/components/project-detail/ProjectDetailCreateStackSheet'
import { ProjectHealthStatus } from '@/src/components/project-detail/ProjectHealthStatus'
import {
	type ProjectEnvironmentRouteParams,
	validateProjectEnvironmentRouteParams,
} from '@/src/utils/routes/schemas'
import { getProjectEnvironmentEnhanced } from '@cloudcrafter/api'

import { Button } from '@cloudcrafter/ui/components/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@cloudcrafter/ui/components/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@cloudcrafter/ui/components/select'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@cloudcrafter/ui/components/tabs'
import {
	Activity,
	Box,
	ChevronRight,
	Clock,
	Cloud,
	Database,
	Layers,
	Play,
	RefreshCw,
	Server,
} from 'lucide-react'

interface PageProps {
	params: ProjectEnvironmentRouteParams
}

export default async function ProjectEnvironmentPage({ params }: PageProps) {
	// Validate the route params
	const routeData = validateProjectEnvironmentRouteParams(params)

	const projectDetails = await getProjectEnvironmentEnhanced(
		routeData['project-uuid'],
		routeData['environment-uuid'],
	)

	const mainCard = (
		<>
			<Card className='bg-white dark:bg-gray-800 shadow-lg mb-8'>
				<CardContent className='p-6'>
					<div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
						<div>
							<div className='flex items-center space-x-3 mb-2'>
								<h2 className='text-3xl font-bold text-gray-800 dark:text-white'>
									{projectDetails.projectName}
								</h2>
								<EnvironmentBadge
									environmentName={projectDetails.environmentName}
								/>
							</div>
							<div className='flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400'>
								<div className='flex items-center'>
									<span>
										Created on:{' '}
										<ShowDate
											dateString={projectDetails.environmentCreatedAt}
										/>
									</span>
								</div>
								<div className='flex items-center'>
									<Clock className='h-4 w-4 mr-1' />
									<span>
										Last deployment:{' '}
										<ShowDate dateString={projectDetails.lastDeploymentAt} />
									</span>
								</div>
							</div>
						</div>
						<div className='mt-4 md:mt-0 flex space-x-4'>
							<div className='text-center'>
								<div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
									{projectDetails.deployedStackCount}
								</div>
								<div className='text-sm text-gray-500 dark:text-gray-400'>
									Total Stacks
								</div>
							</div>
							<div className='text-center'>
								<div className='text-2xl font-bold text-green-600 dark:text-green-400'>
									3
								</div>
								<div className='text-sm text-gray-500 dark:text-gray-400'>
									Active Deployments
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
				<Card className='bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300'>
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<CardTitle className='text-lg font-medium'>
							Deployed Stacks
						</CardTitle>
						<Layers className='h-5 w-5 text-blue-500' />
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold'>
							{projectDetails.deployedStackCount}
						</div>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							Total active stacks
						</p>
					</CardContent>
				</Card>
				<Card className='bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300'>
					<ProjectHealthStatus project={projectDetails} />
				</Card>
				<Card className='bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300'>
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<CardTitle className='text-lg font-medium'>Quick Actions</CardTitle>
						<Play className='h-5 w-5 text-green-500' />
					</CardHeader>
					<CardContent>
						<div className='flex space-x-2'>
							<ProjectDetailCreateStackSheet
								environmentId={routeData['environment-uuid']}
							/>
							<Button size='sm' variant='outline'>
								<RefreshCw className='h-4 w-4 mr-1' />
								Refresh
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className='mb-8'>
				<h2 className='text-2xl font-bold mb-4 text-gray-800 dark:text-white'>
					Deployed Stacks
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{projectDetails.deployedStacks.map((stack) => (
						<StackCard
							projectId={routeData['project-uuid']}
							environmentId={routeData['environment-uuid']}
							key={stack.stackId}
							stack={stack}
						/>
					))}
				</div>
			</div>

			<Tabs defaultValue='overview' className='space-y-4'>
				<TabsList className='bg-white dark:bg-gray-800 p-1 rounded-lg shadow'>
					<TabsTrigger
						value='overview'
						className='data-[state=active]:bg-blue-500 data-[state=active]:text-white'
					>
						Overview
					</TabsTrigger>
					<TabsTrigger
						value='stacks'
						className='data-[state=active]:bg-blue-500 data-[state=active]:text-white'
					>
						Stacks
					</TabsTrigger>
					<TabsTrigger
						value='servers'
						className='data-[state=active]:bg-blue-500 data-[state=active]:text-white'
					>
						Servers
					</TabsTrigger>
				</TabsList>
				<TabsContent value='overview'>
					<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
						<Card className='bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300'>
							<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
								<CardTitle className='text-sm font-medium'>
									Total Stacks
								</CardTitle>
								<Box className='h-4 w-4 text-blue-500' />
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold'>5</div>
								<p className='text-xs text-muted-foreground'>
									+2 from last week
								</p>
							</CardContent>
						</Card>
						<Card className='bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300'>
							<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
								<CardTitle className='text-sm font-medium'>
									Active Servers
								</CardTitle>
								<Server className='h-4 w-4 text-green-500' />
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold'>3</div>
								<p className='text-xs text-muted-foreground'>
									All systems operational
								</p>
							</CardContent>
						</Card>
						<Card className='bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300'>
							<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
								<CardTitle className='text-sm font-medium'>
									Last Deployment
								</CardTitle>
								<Play className='h-4 w-4 text-indigo-500' />
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold'>2h ago</div>
								<p className='text-xs text-muted-foreground'>
									Successful deployment
								</p>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value='stacks'>
					<Card className='bg-white dark:bg-gray-800 shadow-lg'>
						<CardHeader>
							<CardTitle>Available Stacks</CardTitle>
							<CardDescription>
								Deploy and manage your Docker stacks
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className='space-y-4'>
								{[
									'Web stacklication',
									'Database Cluster',
									'Monitoring Stack',
								].map((stack, index) => (
									<li
										key={stack}
										className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200'
									>
										<div className='flex items-center space-x-3'>
											{index === 0 && <Cloud className='text-blue-500' />}
											{index === 1 && <Database className='text-green-500' />}
											{index === 2 && <Activity className='text-purple-500' />}
											<span className='font-medium'>{stack}</span>
										</div>
										<Button
											size='sm'
											className='bg-blue-500 hover:bg-blue-600 text-white'
										>
											Deploy
										</Button>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value='servers'>
					<Card className='bg-white dark:bg-gray-800 shadow-lg'>
						<CardHeader>
							<CardTitle>Connected Servers</CardTitle>
							<CardDescription>
								Manage your server infrastructure
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className='space-y-4'>
								{[
									'server-01.example.com',
									'server-02.example.com',
									'server-03.example.com',
								].map((server) => (
									<li
										key={server}
										className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200'
									>
										<div className='flex items-center space-x-3'>
											<Server className='text-indigo-500' />
											<span className='font-medium'>{server}</span>
										</div>
										<Button
											size='sm'
											variant='outline'
											className='hover:bg-indigo-50 dark:hover:bg-indigo-900'
										>
											Manage
											<ChevronRight className='ml-2 h-4 w-4' />
										</Button>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<Card className='mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'>
				<CardHeader>
					<CardTitle className='text-2xl'>Deploy New Stack</CardTitle>
					<CardDescription className='text-indigo-100'>
						Select a Docker stack to deploy to the current environment
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
						<Select>
							<SelectTrigger className='w-full sm:w-[280px] bg-white/10 border-white/20 text-white'>
								<SelectValue placeholder='Select a stack to deploy' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='web-stack'>Web stacklication</SelectItem>
								<SelectItem value='database'>Database Cluster</SelectItem>
								<SelectItem value='monitoring'>Monitoring Stack</SelectItem>
							</SelectContent>
						</Select>
						<Button className='bg-white text-indigo-600 hover:bg-indigo-100'>
							Deploy Stack
							<Play className='ml-2 h-4 w-4' />
						</Button>
					</div>
				</CardContent>
			</Card>
		</>
	)

	return (
		<div className='flex h-full flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6 flex flex-row'>
				<div className='flex-1 space-y-4'>{mainCard}</div>
			</div>
		</div>
	)
}
