import type { StackDetailDto } from '@/src/core/__generated__'
import { useState } from 'react'
import { ServiceDetail } from './service-detail'

export const ServiceOverview = ({
	stackDetails,
}: { stackDetails: StackDetailDto }) => {
	const services = stackDetails?.services ?? []
	const [editingName, setEditingName] = useState('')

	const [expandedService, setExpandedService] = useState<string | null>(null)

	const toggleService = (serviceName: string) => {
		setExpandedService(expandedService === serviceName ? null : serviceName)
	}

	const handleSave = (originalName: string) => {
		// Here you would typically call an API to update the service name
		console.log('Saving new name:', editingName, 'for service:', originalName)
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
