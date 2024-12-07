'use client'
import type { DeploymentStatusDto } from '@cloudcrafter/api'
import type { SimpleDeploymentDto } from '@cloudcrafter/api'
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
			{deployments.map((deployment) => (
				<li key={deployment.id} className='py-4'>
					<div className='flex items-center justify-between'>
						<div>
							<p
								onClick={() => setShowDeploymentLogsId(deployment.id)}
								className='text-lg text-blue-600 hover:underline font-semibold'
							>
								Manual Deployment
							</p>
							<p className='text-sm text-gray-500'>
								{new Date(deployment.createdAt)
									.toLocaleString('en-GB', {
										day: 'numeric',
										month: 'numeric',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
										second: '2-digit',
										hour12: false,
									})
									.replace(',', ' at')}
							</p>
						</div>
						<DeploymentStatusBadge state={deployment.state} />
					</div>
				</li>
			))}
		</>
	)
}

export const DeploymentStatusBadge = ({
	state,
}: { state: DeploymentStatusDto }) => {
	return (
		<span
			className={`px-2 py-1 rounded-full text-xs font-medium ${
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
