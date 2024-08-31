import type { DeployedStackDto } from '@/src/core/generated'
import { Badge } from '@ui/components/ui/badge'

export const StackHealthBadge = ({ stack }: { stack: DeployedStackDto }) => {
	const isHealthy = stack.healthStatus === 'Healthy'
	return (
		<Badge variant={isHealthy ? 'default' : 'destructive'}>
			{isHealthy ? 'Healthy' : 'Unhealthy'}
		</Badge>
	)
}
