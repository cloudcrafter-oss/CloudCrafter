import type { StackDetailDto } from '@/src/core/__generated__'
import { EntityHealthBadge } from '../../badges/EntityHealthBadge'

export const ServiceOverview = ({
	stackDetails,
}: { stackDetails: StackDetailDto }) => {
	const { services } = stackDetails

	return (
		<div className='service-overview'>
			<h2 className='text-xl font-bold mb-4 dark:text-white'>
				Service Overview
			</h2>
			<ul className='space-y-2'>
				{services.map((service) => (
					<li
						key={service.name}
						className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow'
					>
						<div className='flex justify-between items-center'>
							<h3 className='text-lg font-semibold dark:text-white'>
								{service.name}
							</h3>
							<EntityHealthBadge
								status={service.health.value}
								statusAt={service.health.statusAt}
							/>
						</div>
						<p className='text-sm text-gray-600 dark:text-gray-300'>
							{service.description}
						</p>
					</li>
				))}
			</ul>
		</div>
	)
}
