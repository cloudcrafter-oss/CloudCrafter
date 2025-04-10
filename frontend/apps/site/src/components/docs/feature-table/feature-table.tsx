'use client'

import React from 'react'

// Define the possible statuses
type FeatureStatus = 'Supported' | 'In Development' | 'Planned'

// Define the structure for a feature
interface Feature {
	name: string
	status: FeatureStatus
	description: string
	release: string
	category: string // Added category for potential filtering
	releaseInfo?: string // Added for tooltip content
}

interface TooltipProps {
	content: string
	isOpen: boolean
	onClose: () => void
}

const Tooltip: React.FC<TooltipProps> = ({ content, isOpen, onClose }) => {
	if (!isOpen) return null

	return (
		<>
			{/* Backdrop with fade animation */}
			<div
				className='fixed inset-0 bg-black/50 z-40 animate-fadeIn'
				onClick={onClose}
			/>
			{/* Tooltip with scale and fade animation */}
			<div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50 max-w-md w-full animate-scaleIn'>
				<div className='flex justify-between items-start'>
					<h3 className='text-lg font-medium text-gray-900'>
						Release Information
					</h3>
					<button
						type='button'
						onClick={onClose}
						className='text-gray-400 hover:text-gray-500 transition-colors duration-200'
					>
						<span className='sr-only'>Close</span>✕
					</button>
				</div>
				<div className='mt-4'>
					<p className='text-sm text-gray-500'>{content}</p>
				</div>
			</div>
		</>
	)
}

// Define categories based on the image
const categories = [
	'All',
	'Security',
	'Data Management',
	'Integration',
	'Reporting',
	'Productivity',
	'Customization',
	'AI & Machine Learning',
]

// Helper component for the status badge
const StatusBadge: React.FC<{ status: FeatureStatus }> = ({ status }) => {
	let bgColor = ''
	let textColor = ''
	let icon = null

	switch (status) {
		case 'Supported':
			bgColor = 'bg-green-100'
			textColor = 'text-green-700'
			// Simple circle icon, replace with actual SVG/icon library if available
			icon = (
				<span className='mr-1.5 h-2 w-2 rounded-full bg-green-500 inline-block' />
			)
			break
		case 'In Development':
			bgColor = 'bg-yellow-100'
			textColor = 'text-yellow-700'
			// Simple clock icon placeholder
			icon = <span className='mr-1.5'>⏳</span> // Replace with actual icon
			break
		case 'Planned':
			bgColor = 'bg-gray-100'
			textColor = 'text-gray-700'
			// Simple question mark icon placeholder
			icon = <span className='mr-1.5'>❓</span> // Replace with actual icon
			break
	}

	return (
		<span
			className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
		>
			{icon}
			{status}
		</span>
	)
}

// The main FeatureTable component
export const FeatureTable: React.FC = () => {
	const [selectedCategory, setSelectedCategory] = React.useState<string>('All')
	const [expandedFeature, setExpandedFeature] = React.useState<string | null>(
		null,
	)

	const filteredFeatures =
		selectedCategory === 'All'
			? features
			: features.filter((feature) => feature.category === selectedCategory)

	const toggleFeature = (featureName: string) => {
		setExpandedFeature((current) =>
			current === featureName ? null : featureName,
		)
	}

	return (
		<div className='w-full overflow-x-auto'>
			<div className='mb-4 flex flex-wrap gap-2'>
				{categories.map((category) => (
					<button
						type='button'
						key={category}
						onClick={() => setSelectedCategory(category)}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							selectedCategory === category
								? 'bg-gray-800 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						{category}
					</button>
				))}
			</div>

			<table className='min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm'>
				<thead className='bg-gray-50'>
					<tr>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
						>
							Feature
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
						>
							Status
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
						>
							Description
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
						>
							Release
						</th>
					</tr>
				</thead>
				<tbody className='bg-white divide-y divide-gray-200'>
					{filteredFeatures.map((feature) => (
						<React.Fragment key={feature.name}>
							<tr className='group hover:bg-gray-50'>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
									{feature.name}
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<StatusBadge status={feature.status} />
								</td>
								<td className='px-6 py-4 text-sm text-gray-500 max-w-xs break-words'>
									{feature.description}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
									<div className='flex items-center'>
										<span>{feature.release}</span>
										{(feature.status === 'In Development' ||
											feature.status === 'Planned') &&
											feature.releaseInfo && (
												<button
													type='button'
													onClick={() => toggleFeature(feature.name)}
													className='ml-2 text-gray-400 hover:text-gray-600 transition-colors group-hover:text-gray-600'
													title='Toggle release information'
												>
													<span className='transform transition-transform duration-200 inline-block'>
														{expandedFeature === feature.name ? '▼' : '▶'}
													</span>
												</button>
											)}
									</div>
								</td>
							</tr>
							{expandedFeature === feature.name && feature.releaseInfo && (
								<tr className='bg-gray-50 animate-expandRow'>
									<td colSpan={4} className='px-6 py-4'>
										<div className='text-sm text-gray-600 max-w-3xl'>
											<h4 className='font-medium text-gray-900 mb-2'>
												Release Information
											</h4>
											<p>{feature.releaseInfo}</p>
										</div>
									</td>
								</tr>
							)}
						</React.Fragment>
					))}
				</tbody>
			</table>
		</div>
	)
}

// Sample data based on the image
const features: Feature[] = [
	{
		name: 'User Authentication',
		status: 'Supported',
		description:
			'Secure login and registration with multi-factor authentication support.',
		release: 'Available now',
		category: 'Security',
	},
	{
		name: 'Role-based Access Control',
		status: 'Supported',
		description:
			'Granular permission system for different user roles and teams.',
		release: 'Available now',
		category: 'Security',
	},
	{
		name: 'Data Export',
		status: 'Supported',
		description: 'Export your data in CSV, JSON, or Excel formats.',
		release: 'Available now',
		category: 'Data Management',
	},
	{
		name: 'API Integration',
		status: 'Supported',
		description: 'Connect with third-party services via our RESTful API.',
		release: 'Available now',
		category: 'Integration',
	},
	{
		name: 'Advanced Analytics',
		status: 'In Development',
		description:
			'Detailed insights and visualization of your business metrics.',
		release: 'Q3 2025',
		category: 'Reporting',
		releaseInfo:
			'Our Advanced Analytics feature is currently in active development. Expected release in Q3 2025 with initial support for basic metrics visualization and custom dashboard creation.',
	},
	{
		name: 'Workflow Automation',
		status: 'In Development',
		description: 'Create custom workflows to automate repetitive tasks.',
		release: 'Q2 2025',
		category: 'Productivity',
		releaseInfo:
			'Workflow Automation is being developed with a focus on no-code automation tools. Beta testing planned for Q1 2025 with full release in Q2 2025.',
	},
	{
		name: 'Custom Branding',
		status: 'Planned',
		description: "White-label solution with your company's branding.",
		release: 'Q4 2025',
		category: 'Customization',
		releaseInfo:
			'Custom Branding feature is in our roadmap for Q4 2025. This will include full white-labeling capabilities, custom CSS injection, and theme management.',
	},
	{
		name: 'AI-powered Recommendations',
		status: 'Planned',
		description: 'Smart suggestions based on user behavior and preferences.',
		release: 'Q1 2026',
		category: 'AI & Machine Learning',
		releaseInfo:
			'Our AI-powered Recommendations system is planned for Q1 2026. We are currently researching and designing the ML models that will power this feature.',
	},
]

export default FeatureTable
