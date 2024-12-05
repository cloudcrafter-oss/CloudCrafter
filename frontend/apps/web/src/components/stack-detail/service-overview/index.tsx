import type { StackDetailDto } from '@cloudcrafter/api'
import { useState } from 'react'
import { ServiceDetail } from './service-detail'

export const ServiceOverview = ({
	stackDetails,
}: { stackDetails: StackDetailDto }) => {
	const services = stackDetails?.services ?? []

	const [expandedService, setExpandedService] = useState<string | null>(null)

	const toggleService = (serviceName: string) => {
		setExpandedService(expandedService === serviceName ? null : serviceName)
	}

	if (!services.length) {
		return (
			<div className='space-y-4'>
				<h2 className='text-2xl font-semibold tracking-tight'>
					Service Overview
				</h2>
				<p className='text-muted-foreground'>No services found.</p>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<h2 className='text-2xl font-semibold tracking-tight'>
				Service Overview
			</h2>

			<div className='space-y-2'>
				{services.map((service) => (
					<ServiceDetail
						stackId={stackDetails.id}
						key={service.id}
						service={service}
						toggleService={toggleService}
						expandedService={expandedService}
					/>
				))}
			</div>
		</div>
	)
}
