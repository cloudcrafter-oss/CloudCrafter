import { DeploymentStatusBadge } from '@/src/components/stack-detail/deployments/deployment-list'
import {
	type ServerDetailDto,
	useGetDeploymentsForServerHook,
} from '@cloudcrafter/api'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@cloudcrafter/ui/components/card'
import { formatDistanceToNow } from 'date-fns'
import { PackageIcon, RocketIcon } from 'lucide-react'
import Link from 'next/link'

interface RecentDeploymentsCardProps {
	server: ServerDetailDto
}

export const RecentDeploymentsCard = ({
	server,
}: RecentDeploymentsCardProps) => {
	const {
		data: deployments,
		isLoading,
		error,
	} = useGetDeploymentsForServerHook(server.id, {
		Page: 1,
		PageSize: 10,
	})

	return (
		<Card className='bg-card/50 backdrop-blur-sm border-border/50 sticky top-4'>
			<CardHeader className='pb-4'>
				<div className='flex items-center gap-3'>
					<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20'>
						<RocketIcon className='h-5 w-5 text-primary' />
					</div>
					<div>
						<CardTitle className='text-xl'>Recent Deployments</CardTitle>
						<CardDescription className='text-muted-foreground/80'>
							View recent deployment activity for this server.
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{deployments?.result.map((deployment) => (
						<div
							key={deployment.id}
							className='grid grid-cols-[40px_1fr] items-center gap-4'
						>
							<div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground'>
								<PackageIcon className='h-5 w-5' />
							</div>
							<div>
								<Link
									href={`/admin/projects/${deployment.projectId}/${deployment.environmentId}/stack/${deployment.stackId}`}
									className='font-medium'
								>
									{deployment.stackName}
								</Link>
								<div className='text-sm text-muted-foreground'>
									<span title={new Date(deployment.createdAt).toLocaleString()}>
										Deployed{' '}
										{formatDistanceToNow(new Date(deployment.createdAt), {
											addSuffix: true,
										})}
									</span>
								</div>
								<DeploymentStatusBadge state={deployment.state} />
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
