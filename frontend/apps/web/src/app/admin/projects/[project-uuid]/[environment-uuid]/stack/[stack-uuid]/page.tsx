import StackConfigPage from '@/src/components/stack-detail/StackConfigPage'
import { DeploymentList } from '@/src/components/stack-detail/deployments/deployment-list'
import {
	type StackRouteParams,
	validateStackRouteParams,
} from '@/src/utils/routes/schemas'
import { getDeploymentsForStack, getStackDetail } from '@cloudcrafter/api'

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@cloudcrafter/ui/components/tabs'

interface PageProps {
	params: Promise<StackRouteParams>
}

export default async function StackPage({ params }: PageProps) {
	const resolvedParams = await params
	const routeData = validateStackRouteParams(resolvedParams)

	const stackDetails = await getStackDetail(routeData['stack-uuid'])
	const deployments = await getDeploymentsForStack(routeData['stack-uuid'])
	const tabs = [
		{
			name: 'Configuration',
			key: 'configuration',
		},
		{
			name: 'Deployments',
			key: 'deployments',
		},
	]

	return (
		<div className='flex h-full flex-col'>
			<div className='flex-1 p-2 sm:p-8 sm:pt-6'>
				<div className='flex-1 space-y-4'>
					<Tabs defaultValue='configuration' className='space-y-4'>
						<TabsList className='w-full justify-start overflow-x-auto'>
							{tabs.map((tab) => (
								<TabsTrigger
									key={tab.key}
									value={tab.key}
									className='text-sm sm:text-base px-3 sm:px-4'
								>
									{tab.name}
								</TabsTrigger>
							))}
						</TabsList>
						<TabsContent value='configuration' className='space-y-4'>
							<StackConfigPage stackDetails={stackDetails} />
						</TabsContent>
						<TabsContent value='deployments' className='space-y-4'>
							<div className='space-y-4'>
								<h2 className='text-xl sm:text-2xl font-bold px-2 sm:px-0'>
									Deployments
								</h2>
								<ul className='divide-y divide-gray-200'>
									<DeploymentList deployments={deployments} />
								</ul>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	)
}
