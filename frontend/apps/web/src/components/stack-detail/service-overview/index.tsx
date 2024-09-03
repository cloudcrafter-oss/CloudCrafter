import type { StackDetailDto } from '@/src/core/__generated__'

export const ServiceOverview = ({
	stackDetails,
}: { stackDetails: StackDetailDto }) => {
	const { services } = stackDetails
	return (
		<div className='service-overview'>
			<h2 className='text-xl font-bold mb-4'>Service Overview</h2>
			<ul className='space-y-2'>
				{services.map((service, index) => (
					<li key={index} className='bg-gray-100 p-4 rounded-lg shadow'>
						<h3 className='text-lg font-semibold'>{service.name}</h3>
						<p className='text-sm text-gray-600'>description</p>
					</li>
				))}
			</ul>
		</div>
	)
}
