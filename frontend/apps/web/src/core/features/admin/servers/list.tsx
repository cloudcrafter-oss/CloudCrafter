import type { GetServersQueryResponse } from '@/src/core/__generated__'
import { Button } from '@ui/components/ui/button.tsx'
import { Card } from '@ui/components/ui/card.tsx'
import {
	CircleIcon,
	GaugeIcon,
	HardDriveIcon,
	MemoryStickIcon,
	ServerIcon,
} from 'lucide-react'
import Link from 'next/link'

const StateMap = {
	Offline: (
		<div className='flex items-center gap-2 text-sm text-muted-foreground'>
			<CircleIcon className='w-2 h-2 fill-red-500' />
			<span>Offline</span>
		</div>
	),
	Maintenance: (
		<div className='flex items-center gap-2 text-sm text-muted-foreground'>
			<CircleIcon className='w-2 h-2 fill-yellow-500' />
			<span>Maintenance</span>
		</div>
	),
	Online: (
		<div className='flex items-center gap-2 text-sm text-muted-foreground'>
			<CircleIcon className='w-2 h-2 fill-green-500' />
			<span>Online</span>
		</div>
	),
}

export const ServersList = ({
	servers,
}: { servers: GetServersQueryResponse }) => {
	const randomFromStateMap = () => {
		const keys = Object.keys(StateMap)
		// @ts-expect-error Todo: fix this
		return StateMap[keys[Math.floor(Math.random() * keys.length)]]
	}

	return (
		<main className='flex flex-col gap-8 p-4 md:p-10 bg-muted/40 flex-1'>
			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full mx-auto'>
				{servers.map((server) => (
					<Card key={server.id} className='p-6 grid gap-6'>
						<div className='flex items-center gap-4'>
							<div className='bg-primary rounded-md p-3 flex items-center justify-center'>
								<ServerIcon className='w-6 h-6 text-primary-foreground' />
							</div>
							<div className='grid gap-1'>
								<h3 className='text-xl font-semibold'>{server.name}</h3>
								{randomFromStateMap()}
							</div>
						</div>
						<div className='grid gap-4'>
							<div className='flex items-center justify-between'>
								<span className='text-muted-foreground'>CPU</span>
								<div className='flex items-center gap-2'>
									<span className='font-semibold'>72%</span>
									<GaugeIcon className='w-5 h-5 text-muted-foreground' />
								</div>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-muted-foreground'>Memory</span>
								<div className='flex items-center gap-2'>
									<span className='font-semibold'>8.2 GB / 16 GB</span>
									<MemoryStickIcon className='w-5 h-5 text-muted-foreground' />
								</div>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-muted-foreground'>Disk</span>
								<div className='flex items-center gap-2'>
									<span className='font-semibold'>512 GB / 1 TB</span>
									<HardDriveIcon className='w-5 h-5 text-muted-foreground' />
								</div>
							</div>
						</div>
						<Button variant='outline' className='justify-self-start'>
							<Link href={`/admin/servers/${server.id}`}>View Details</Link>
						</Button>
					</Card>
				))}
			</div>
		</main>
	)
}
