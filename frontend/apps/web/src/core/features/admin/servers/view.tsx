import type { ServerDetailDto } from '@/src/core/__generated__'
import { Button } from '@ui/components/ui/button.tsx'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@ui/components/ui/card.tsx'
import { Input } from '@ui/components/ui/input.tsx'
import { Label } from '@ui/components/ui/label.tsx'
import { Textarea } from '@ui/components/ui/textarea.tsx'
import { DatabaseIcon, PackageIcon, ServerIcon } from 'lucide-react'
import Link from 'next/link'

export const ViewServerDetail = ({ server }: { server: ServerDetailDto }) => {
	return (
		<div className='container mx-auto px-4 py-12 md:px-6 lg:px-8 grid md:grid-cols-2 gap-6'>
			<div>
				<Card>
					<CardHeader>
						<CardTitle>Server Configuration</CardTitle>
						<CardDescription>
							Manage your server settings for your Docker applications.
						</CardDescription>
					</CardHeader>
					<CardContent className='grid gap-4'>
						<div className='grid gap-2'>
							<Label htmlFor='hostname'>Name</Label>
							<Input id='hostname' defaultValue={server.name} />
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='ssh-key'>Agent Secret</Label>
							<Textarea
								id='ssh-key'
								defaultValue={server.agentKey ?? ''}
								autoComplete='off'
								className='min-h-[100px]'
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button>Save Changes</Button>
					</CardFooter>
				</Card>
			</div>
			<div>
				<Card>
					<CardHeader>
						<CardTitle>Recent Deployments</CardTitle>
						<CardDescription>
							View the latest deployments for your applications.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='grid gap-4'>
							<div className='grid grid-cols-[40px_1fr] items-center gap-4'>
								<div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground'>
									<PackageIcon className='h-5 w-5' />
								</div>
								<div>
									<div className='font-medium'>Acme Web App</div>
									<div className='text-sm text-muted-foreground'>
										Deployed 2 hours ago
									</div>
								</div>
							</div>
							<div className='grid grid-cols-[40px_1fr] items-center gap-4'>
								<div className='flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground'>
									<DatabaseIcon className='h-5 w-5' />
								</div>
								<div>
									<div className='font-medium'>Acme Database</div>
									<div className='text-sm text-muted-foreground'>
										Deployed 4 hours ago
									</div>
								</div>
							</div>
							<div className='grid grid-cols-[40px_1fr] items-center gap-4'>
								<div className='flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground'>
									<ServerIcon className='h-5 w-5' />
								</div>
								<div>
									<div className='font-medium'>Acme API</div>
									<div className='text-sm text-muted-foreground'>
										Deployed 6 hours ago
									</div>
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Link href='#' className='text-sm text-primary' prefetch={false}>
							View all deployments
						</Link>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}
