import type { DeployedStackDto } from '@/src/core/__generated__'
import { Button } from '@ui/components/ui/button'
import { Card, CardContent } from '@ui/components/ui/card'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { EntityHealthBadge } from '../../badges/EntityHealthBadge'

export const StackCard = ({
	stack,
	projectId,
	environmentId,
}: {
	stack: DeployedStackDto
	projectId: string
	environmentId: string
}) => {
	return (
		<Card className='bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow duration-200'>
			<CardContent className='p-4 flex items-center justify-between'>
				<div className='flex items-center space-x-3'>
					<span className='font-medium text-gray-700 dark:text-gray-200'>
						{stack.name}
					</span>
					<Link
						href={`/admin/projects/${projectId}/${environmentId}/stack/${stack.stackId}`}
						passHref
					>
						<Button className='p-2'>
							{' '}
							{/* Updated padding */}
							<ExternalLink className='h-4 w-4' />
						</Button>
					</Link>
				</div>
				<EntityHealthBadge
					statusAt={stack.health.statusAt}
					status={stack.health.value}
				/>
			</CardContent>
		</Card>
	)
}
