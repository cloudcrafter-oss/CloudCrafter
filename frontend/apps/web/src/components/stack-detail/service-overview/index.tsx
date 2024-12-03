import type { StackDetailDto } from '@/src/core/__generated__'
import { Button } from '@ui/components/ui/button'
import { Input } from '@ui/components/ui/input'
import { Label } from '@ui/components/ui/label'
import { ScrollArea } from '@ui/components/ui/scroll-area'
import { ChevronDown } from 'lucide-react'
import { ChevronUp } from 'lucide-react'
import { useState } from 'react'

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
					<div key={service.id} className='border rounded-lg overflow-hidden'>
						<Button
							variant='ghost'
							className='w-full justify-between p-4 text-left hover:bg-secondary'
							onClick={() => toggleService(service.name)}
						>
							<span className='text-lg font-semibold'>{service.name}</span>
							{expandedService === service.name ? (
								<ChevronUp className='h-5 w-5' />
							) : (
								<ChevronDown className='h-5 w-5' />
							)}
						</Button>
						{expandedService === service.name && (
							<ScrollArea className='h-[300px] p-4 bg-secondary/50'>
								<div className='space-y-4 px-[4px] pb-[4px]'>
									<div>
										<Label htmlFor={`${service.name}-domain`}>
											Domain Name
										</Label>
										<Input
											id={`${service.name}-domain`}
											placeholder='Enter domain name'
										/>
									</div>

									<div>
										<Label htmlFor={`${service.name}-port`}>
											Container Port
										</Label>
										<Input
											id={`${service.name}-port`}
											type='number'
											placeholder='Enter container port'
										/>
									</div>
								</div>
							</ScrollArea>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
