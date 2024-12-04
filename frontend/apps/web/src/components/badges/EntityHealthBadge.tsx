import type { EntityHealthDtoValue } from '@cloudcrafter/api/src/__generated__/types/EntityHealthDtoValue'
import { Badge } from '@ui/components/ui/badge'
import { TooltipContent } from '@ui/components/ui/tooltip'
import { Tooltip, TooltipTrigger } from '@ui/components/ui/tooltip'
import { TooltipProvider } from '@ui/components/ui/tooltip'
import ShowDate from '../ShowDate'

export const EntityHealthBadge = ({
	statusAt,
	status,
	blink = false,
}: {
	statusAt: string | null | undefined
	status: EntityHealthDtoValue
	blink?: boolean
}) => {
	const classMap = {
		Healthy: 'bg-green-500/80 dark:bg-green-600/80',
		Unhealthy: 'bg-red-500/80 dark:bg-red-600/80',
		Unknown: 'bg-gray-500/80 dark:bg-gray-600/80',
		HeathCheckOverdue: 'bg-red-700/80 dark:bg-red-800/80',
	}

	const statusString = {
		Healthy: 'Healthy',
		Unhealthy: 'Unhealthy',
		Unknown: 'Unknown',
		HeathCheckOverdue: 'Health Check Overdue',
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger disabled>
					<Badge
						className={`${classMap[status as keyof typeof classMap] ?? classMap.Unknown} hover:${classMap[status as keyof typeof classMap] ?? classMap.Unknown} cursor-pointer ${blink ? 'animate-pulse' : ''}`}
					>
						<p className='cursor-pointer text-black dark:text-white'>
							{statusString[status as keyof typeof statusString]}
						</p>
					</Badge>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						Last update at:{' '}
						{statusAt ? <ShowDate dateString={statusAt} /> : 'Never'}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
