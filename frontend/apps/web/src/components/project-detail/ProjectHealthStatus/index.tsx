import type { ProjectEnvironmentEnhancedDto } from '@cloudcrafter/api'
import { CardContent, CardHeader, CardTitle } from '@cloudcrafter/ui/components/card'
import { ActivityIcon, AlertCircle, CheckCircle } from 'lucide-react'

export const ProjectHealthStatus = ({
	project,
}: { project: ProjectEnvironmentEnhancedDto }) => {
	const unhealthyStacks = project.deployedStacks.filter(
		(stack) => stack.health.value !== 'Healthy',
	)

	const allHealthy = project.deployedStacks.every(
		(stack) => stack.health.value === 'Healthy',
	)

	const activityColor = allHealthy ? 'text-green-500' : 'text-yellow-500'

	return (
		<>
			<CardHeader className='flex flex-row items-center justify-between pb-2'>
				<CardTitle className='text-lg font-medium'>Health Status</CardTitle>
				<ActivityIcon className={`h-5 w-5 ${activityColor}`} />
			</CardHeader>
			<CardContent>
				<div className='flex items-center space-x-2'>
					{unhealthyStacks.length > 0 ? (
						<>
							<AlertCircle className='h-5 w-5 text-yellow-500' />
							<span className='text-lg font-medium'>Warning</span>
						</>
					) : (
						<>
							<CheckCircle className='h-5 w-5 text-green-500' />
							<span className='text-lg font-medium'>All Good</span>
						</>
					)}
				</div>
				{unhealthyStacks.length > 0 && (
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						{unhealthyStacks.length}{' '}
						{unhealthyStacks.length === 1 ? 'Stack requires' : 'Stacks require'}{' '}
						attention
					</p>
				)}
			</CardContent>
		</>
	)
}
