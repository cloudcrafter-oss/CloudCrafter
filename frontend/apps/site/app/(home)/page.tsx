import { HomepageHero } from '@/components/HomepageHero'

// Add this metadata export before your components
export const metadata = {
	title: 'CloudCrafter - Deploy Docker stacks easily',
	description:
		'CloudCrafter helps you deploy and manage your Docker stacks easily. Streamline your deployment process with our powerful platform.',
	keywords:
		'cloud deployment, DevOps, cloud computing, docker, docker stacks, containerization, one-click apps',
	openGraph: {
		title: 'CloudCrafter - Deploy Docker stacks easily',
		description:
			'CloudCrafter helps you deploy and manage your Docker stacks easily. Streamline your deployment process with our powerful platform.',
		images: [
			{
				url: '/logo.png',
				width: 1200,
				height: 630,
				alt: 'CloudCrafter',
			},
		],
	},
}

export default function Home() {
	return (
		<div className='min-h-screen bg-white'>
			<HomepageHero />
		</div>
	)
}
