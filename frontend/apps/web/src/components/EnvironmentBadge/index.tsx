import { Badge } from '@cloudcrafter/ui/components/badge'

export const EnvironmentBadge = ({
	environmentName,
}: { environmentName: string }) => {
	return (
		<Badge
			variant='outline'
			data-testid='environment-badge'
			className='text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700'
		>
			{environmentName}
		</Badge>
	)
}
