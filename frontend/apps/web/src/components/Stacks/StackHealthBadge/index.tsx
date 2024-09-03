import type { DeployedStackDto } from '@/src/core/__generated__'
import { Badge } from '@ui/components/ui/badge'

export const StackHealthBadge = ({ stack }: { stack: DeployedStackDto }) => {
	const isHealthy = stack.healthStatus === 'Healthy'

	if (stack.healthStatus === 'Unknown') {
		return <Badge variant='neutral'>Unknown</Badge>
	}

	return (
		<Badge variant={isHealthy ? 'default' : 'destructive'}>
			{isHealthy ? 'Healthy' : 'Unhealthy'}
		</Badge>
	)
}
