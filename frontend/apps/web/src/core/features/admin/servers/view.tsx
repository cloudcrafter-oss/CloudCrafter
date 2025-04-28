'use client'

import type { ServerDetailDto } from '@cloudcrafter/api'
import { DockerConfigurationCard } from './components/DockerConfigurationCard'
import { GeneralSettingsCard } from './components/GeneralSettingsCard'
import { RecentDeploymentsCard } from './components/RecentDeploymentsCard'
import { SecuritySettingsCard } from './components/SecuritySettingsCard'
export const ViewServerDetail = ({ server }: { server: ServerDetailDto }) => {
	return (
		<div className='container mx-auto p-6'>
			<div className='grid gap-6 md:grid-cols-[2fr_1fr]'>
				<div className='space-y-6'>
					<GeneralSettingsCard server={server} />
					<DockerConfigurationCard server={server} />
					<SecuritySettingsCard server={server} />
				</div>
				<div>
					<RecentDeploymentsCard server={server} />
				</div>
			</div>
		</div>
	)
}
