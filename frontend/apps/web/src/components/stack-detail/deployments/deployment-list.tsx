'use client'
import type { DeploymentStatusDto } from '@cloudcrafter/api'
import type { SimpleDeploymentDto } from '@cloudcrafter/api'
import { Card, CardContent } from '@cloudcrafter/ui/components/card'
import { formatDistanceToNow } from 'date-fns'
import { RocketIcon } from 'lucide-react'
import { useState } from 'react'
import { ChannelLogViewerEnhanced } from '../../logviewer/ChannelLogViewer'

export const DeploymentList = ({
	deployments,
}: { deployments: SimpleDeploymentDto[] }) => {
	const [showDeploymentLogsId, setShowDeploymentLogsId] = useState<
		string | null
	>(null)

	return (
		<>
			<ChannelLogViewerEnhanced
				channelId={showDeploymentLogsId || ''}
				show={showDeploymentLogsId != null}
				onHide={() => setShowDeploymentLogsId(null)}
			/>
			<Card className='overflow-hidden'>
				<CardContent className='p-0'>
					<div className='divide-y divide-border'>
						{deployments.map((deployment) => (
							<div
								key={deployment.id}
								className='flex items-center justify-between p-3 hover:bg-muted/50 transition-colors'
							>
								<div className='flex items-center gap-3 min-w-0'>
									<div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20'>
										<RocketIcon className='h-4 w-4 text-primary' />
									</div>
									<div className='min-w-0'>
										<p
											onClick={() => setShowDeploymentLogsId(deployment.id)}
											className='text-sm font-medium truncate text-blue-600 hover:underline cursor-pointer'
										>
											Manual Deployment
										</p>
										<p
											className='text-xs text-muted-foreground truncate'
											title={new Date(deployment.createdAt).toLocaleString()}
										>
											{formatDistanceToNow(new Date(deployment.createdAt), {
												addSuffix: true,
											})}
										</p>
									</div>
								</div>
								<DeploymentStatusBadge state={deployment.state} />
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</>
	)
}

export const DeploymentStatusBadge = ({
	state,
}: { state: DeploymentStatusDto }) => {
	return (
		<span
			className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
				state === 'Succeeded'
					? 'bg-green-100 text-green-800'
					: state === 'Failed'
						? 'bg-red-100 text-red-800'
						: state === 'Running'
							? 'bg-blue-100 text-blue-800'
							: 'bg-yellow-100 text-yellow-800'
			}`}
		>
			{state}
		</span>
	)
}
