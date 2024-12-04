'use client'
import { DeploymentStatusBadge } from '@/src/components/stack-detail/deployments/deployment-list'
import {
	getServersQueryKey,
	useDeleteServerByIdHook,
	useGetDeploymentsForServerHook,
	usePostRotateAgentKeyHook,
} from '@cloudcrafter/api'
import type { ServerDetailDto } from '@cloudcrafter/api/src/__generated__/types/ServerDetailDto'

import { useQueryClient } from '@tanstack/react-query'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@ui/components/ui/alert-dialog'
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
import { formatDistanceToNow } from 'date-fns'
import { CopyIcon, PackageIcon, RefreshCwIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const ViewServerDetail = ({ server }: { server: ServerDetailDto }) => {
	const { data: deployments } = useGetDeploymentsForServerHook(server.id, {
		Page: 1,
		PageSize: 10,
	})

	const router = useRouter()

	const queryClient = useQueryClient()

	const deleteServer = useDeleteServerByIdHook({
		mutation: {
			onSuccess: () => {
				toast.success('Server deleted successfully')
				queryClient.invalidateQueries({ queryKey: getServersQueryKey() })
				router.push('/admin/servers')
			},
		},
	})

	const rotateAgentKey = usePostRotateAgentKeyHook({
		mutation: {
			onSuccess: () => {
				toast.success('Agent key rotated successfully')
				router.refresh()
			},
		},
	})

	const handleDeleteServer = () => {
		deleteServer.mutate({ id: server.id })
	}

	const handleRotateAgentKey = () => {
		rotateAgentKey.mutate({ id: server.id })
	}

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
							<Label htmlFor='hostname'>ID</Label>
							<div className='flex gap-2'>
								<Input
									readOnly
									id='hostname'
									defaultValue={server.id}
									className='flex-1'
								/>
								<Button
									variant='outline'
									size='icon'
									onClick={() => {
										navigator.clipboard.writeText(server.id)
										toast.success('Copied Agent ID to clipboard')
									}}
								>
									<CopyIcon className='h-4 w-4' />
								</Button>
							</div>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='ssh-key'>Agent Secret</Label>
							<div className='flex gap-2'>
								<Input
									id='ssh-key'
									defaultValue={server.agentKey ?? ''}
									readOnly
									className='flex-1'
								/>
								<Button
									variant='outline'
									size='icon'
									onClick={() => {
										navigator.clipboard.writeText(server.agentKey ?? '')
										toast.success('Copied Agent Secret to clipboard')
									}}
								>
									<CopyIcon className='h-4 w-4' />
								</Button>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant='outline' size='icon'>
											<RefreshCwIcon className='h-4 w-4' />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Rotate Agent Key?</AlertDialogTitle>
											<AlertDialogDescription>
												This will generate a new agent key. The old key will no
												longer work. Any connected agents will need to be
												updated with the new key. These will be disconnected
												automatically.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction onClick={handleRotateAgentKey}>
												Rotate Key
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button>Save Changes</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant='destructive' className='ml-auto'>
									<TrashIcon className='h-4 w-4 mr-2' />
									Delete Server
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										this server.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleDeleteServer}
										className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
									>
										Delete Server
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
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
							{deployments?.result.map((deployment) => (
								<div
									key={deployment.id}
									className='grid grid-cols-[40px_1fr] items-center gap-4'
								>
									<div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground'>
										<PackageIcon className='h-5 w-5' />
									</div>
									<div>
										<Link
											href={`/admin/projects/${deployment.projectId}/${deployment.environmentId}/stack/${deployment.stackId}`}
											className='font-medium'
										>
											{deployment.stackName}
										</Link>
										<div className='text-sm text-muted-foreground'>
											<span
												title={new Date(deployment.createdAt).toLocaleString()}
											>
												Deployed{' '}
												{formatDistanceToNow(new Date(deployment.createdAt), {
													addSuffix: true,
												})}
											</span>
										</div>
										<DeploymentStatusBadge state={deployment.state} />
									</div>
								</div>
							))}
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
