import StackConfigPage from '@/src/components/stack-detail/StackConfigPage'
import { getStackDetail } from '@/src/core/__generated__'
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
							<pre>{JSON.stringify(stackDetails, null, 2)}</pre>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	)
}
