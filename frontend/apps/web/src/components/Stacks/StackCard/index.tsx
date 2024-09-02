import type { DeployedStackDto } from '@/src/core/__generated__'
import { Card, CardContent } from '@ui/components/ui/card'
import { AlertTriangle, CheckCircle, HelpCircle, XCircle } from 'lucide-react'
import { StackHealthBadge } from '../StackHealthBadge'

export const StackCard = ({ stack }: { stack: DeployedStackDto }) => {
	const getHealthIcon = () => {
		switch (stack.healthStatus) {
			case 'Healthy':
				return <CheckCircle className='text-green-500 h-5 w-5' />
			case 'Unhealthy':
				return <XCircle className='text-red-500 h-5 w-5' />
			case 'Degraded':
				return <AlertTriangle className='text-yellow-500 h-5 w-5' />
			case 'Unknown':
				return <HelpCircle className='text-gray-500 h-5 w-5' />
			default:
				return null
		}
	}

	return (
		<Card className='bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow duration-200'>
			<CardContent className='p-4 flex items-center justify-between'>
				<div className='flex items-center space-x-3'>
					{getHealthIcon()}
					<span className='font-medium text-gray-700 dark:text-gray-200'>
						{stack.name}
					</span>
				</div>
				<StackHealthBadge stack={stack} />
			</CardContent>
		</Card>
	)
}