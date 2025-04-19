import StackConfigPage from '@/src/components/stack-detail/StackConfigPage'
import {
	type StackRouteParams,
	validateStackRouteParams,
} from '@/src/utils/routes/schemas'
import { getStackDetail } from '@cloudcrafter/api'

interface PageProps {
	params: Promise<StackRouteParams>
}

export default async function StackPage({ params }: PageProps) {
	const resolvedParams = await params
	const routeData = validateStackRouteParams(resolvedParams)

	const stackDetails = await getStackDetail(routeData['stack-uuid'])

	return (
		<div className='flex h-full flex-col'>
			<div className='flex-1 p-2 sm:p-8 sm:pt-6'>
				<div className='flex-1 space-y-4'>
					<StackConfigPage stackDetails={stackDetails} />
				</div>
			</div>
		</div>
	)
}
