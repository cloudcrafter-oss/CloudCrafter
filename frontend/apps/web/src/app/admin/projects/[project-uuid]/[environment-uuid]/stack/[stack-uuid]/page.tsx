import StackConfigPage from '@/src/components/stack-detail/StackConfigPage'
import {
	getDeploymentsForStack,
	getStackDetail,
} from '@/src/core/__generated__'
import {
	type StackRouteParams,
	validateStackRouteParams,
} from '@/src/utils/routes/schemas'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@ui/components/ui/tabs'

interface PageProps {
	params: StackRouteParams
}

export default async function StackPage({ params }: PageProps) {
	const routeData = validateStackRouteParams(params)

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
			<div className='flex-1 space-y-4 p-8 pt-6 flex flex-row'>
				<div className='flex-1 space-y-4'>
					<Tabs defaultValue='configuration' className='space-y-4'>
						<TabsList>
							{tabs.map((tab) => (
								<TabsTrigger key={tab.key} value={tab.key}>
									{tab.name}
								</TabsTrigger>
							))}
						</TabsList>
						<TabsContent value='configuration' className='space-y-4'>
							<StackConfigPage stackDetails={stackDetails} />
						</TabsContent>
						<TabsContent value='deployments' className='space-y-4'>
							<div className='space-y-4'>
								<h2 className='text-2xl font-bold'>Deployments</h2>
								<ul className='divide-y divide-gray-200'>
									{deployments.map((deployment) => (
										<li key={deployment.id} className='py-4'>
											<div className='flex items-center justify-between'>
												<div>
													<p className='text-lg font-semibold'>status</p>
													<p className='text-sm text-gray-500'>
														{new Date(deployment.createdAt)
															.toLocaleString('en-GB', {
																day: 'numeric',
																month: 'numeric',
																year: 'numeric',
																hour: '2-digit',
																minute: '2-digit',
																second: '2-digit',
																hour12: false,
															})
															.replace(',', ' at')}
													</p>
												</div>
												<span
												// className={`px-2 py-1 rounded-full text-xs font-medium ${
												// 	true
												// 		? 'bg-green-100 text-green-800'
												// 		: true
												// 			? 'bg-red-100 text-red-800'
												// 			: 'bg-yellow-100 text-yellow-800'
												// }`}
												>
													statu
												</span>
											</div>
										</li>
									))}
								</ul>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	)
}
