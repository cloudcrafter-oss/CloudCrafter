import type { ServerDetailDto } from '@/src/core/generated'
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@ui/components/ui/select.tsx'
import { Textarea } from '@ui/components/ui/textarea.tsx'
import { DatabaseIcon, PackageIcon, ServerIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const ViewServerDetail = ({ server }: { server: ServerDetailDto }) => {
	console.log({ server })
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
							<Label htmlFor='hostname'>Hostname</Label>
							<Input id='hostname' defaultValue='my-server.example.com' />
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='username'>Username</Label>
							<Input
								id='username'
								type='password'
								defaultValue='myusername'
								autoComplete='username'
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='ssh-key'>SSH Key</Label>
							<Textarea
								id='ssh-key'
								defaultValue='ssh-rsa AAAAB3NzaC1yc2EAA...'
								autoComplete='off'
								className='min-h-[100px]'
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='docker-version'>Docker Version</Label>
							<Select defaultValue='20.10.14'>
								<SelectTrigger>
									<SelectValue placeholder='Select Docker version' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='20.10.14'>20.10.14</SelectItem>
									<SelectItem value='20.10.13'>20.10.13</SelectItem>
									<SelectItem value='20.10.12'>20.10.12</SelectItem>
									<SelectItem value='20.10.11'>20.10.11</SelectItem>
									<SelectItem value='20.10.10'>20.10.10</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='docker-registry'>Docker Registry</Label>
							<Input
								id='docker-registry'
								defaultValue='https://registry.example.com'
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
