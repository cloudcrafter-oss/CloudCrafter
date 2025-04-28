'use client'

import {
	type ServerDetailDto,
	updateServerDtoSchema,
	useDeleteServerByIdHook,
	usePostRotateAgentKeyHook,
	useUpdateServerHook,
} from '@cloudcrafter/api'
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
} from '@cloudcrafter/ui/components/alert-dialog'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@cloudcrafter/ui/components/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@cloudcrafter/ui/components/form'
import { Input } from '@cloudcrafter/ui/components/input'
import { Label } from '@cloudcrafter/ui/components/label'
import { AnimatedSaveButton } from '@cloudcrafter/ui/custom-components/animated-save-button'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	CircleIcon,
	CopyIcon,
	RefreshCwIcon,
	ServerIcon,
	Trash2Icon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

interface GeneralSettingsCardProps {
	server: ServerDetailDto
}

const schema = updateServerDtoSchema
	.pick({ name: true })
	.required()
	.refine((data) => data.name && data.name.length >= 1, {
		message: 'Server name is required',
		path: ['name'],
	})

export const GeneralSettingsCard = ({ server }: GeneralSettingsCardProps) => {
	const router = useRouter()

	const serverMutation = useUpdateServerHook({
		mutation: {
			onSuccess: () => {
				toast.success('Server updated successfully')
				router.refresh()
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

	const deleteServer = useDeleteServerByIdHook({
		mutation: {
			onSuccess: () => {
				toast.success('Server deleted successfully')
				router.push('/admin/servers')
			},
		},
	})

	const handleRotateAgentKey = () => {
		rotateAgentKey.mutate({ id: server.id })
	}

	const handleDeleteServer = () => {
		deleteServer.mutate({ id: server.id })
	}

	const serverBasicForm = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: server.name,
		},
	})

	const onSubmit = (data: z.infer<typeof schema>) => {
		serverMutation.mutate({
			id: server.id,
			data: {
				name: data.name,
			},
		})
	}

	return (
		<Card className='bg-card/50 backdrop-blur-sm border-border/50'>
			<CardHeader className='pb-4'>
				<div className='flex items-center gap-3'>
					<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20'>
						<ServerIcon className='h-5 w-5 text-primary' />
					</div>
					<div>
						<CardTitle className='text-xl'>General Settings</CardTitle>
						<CardDescription className='text-muted-foreground/80'>
							Basic server configuration and identification.
						</CardDescription>
					</div>
				</div>
				<div className='mt-4 flex items-center gap-2 text-sm'>
					<CircleIcon className='h-2.5 w-2.5 fill-green-500 text-green-500' />
					<span className='text-muted-foreground/80'>Connected</span>
					{server.dockerNetworkName && (
						<>
							<span className='text-muted-foreground/60'>•</span>
							<span className='text-muted-foreground/80'>
								Network: {server.dockerNetworkName}
							</span>
						</>
					)}
				</div>
			</CardHeader>
			<Form {...serverBasicForm}>
				<form
					onSubmit={serverBasicForm.handleSubmit(onSubmit)}
					className='flex flex-col gap-4'
				>
					<CardContent className='grid gap-6'>
						<FormField
							control={serverBasicForm.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Server Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											value={field.value || ''}
											className='bg-muted/50 border-border/50 focus-visible:ring-primary/20'
											placeholder='Enter server name'
										/>
									</FormControl>
									<p className='text-sm text-muted-foreground/80'>
										The name of the server. This will be used to identify the
										server in the UI.
									</p>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='grid gap-2'>
							<Label htmlFor='id' className='text-sm font-medium'>
								ID
							</Label>
							<div className='flex gap-2'>
								<Input
									readOnly
									id='id'
									defaultValue={server.id}
									className='flex-1 font-mono text-sm bg-muted/50 border-border/50'
								/>
								<Button
									variant='outline'
									size='icon'
									onClick={() => {
										if (navigator.clipboard) {
											navigator.clipboard.writeText(server.id)
											toast.success('Copied Agent ID to clipboard')
										} else {
											toast.error(
												'Could not copy Agent ID to clipboard - copy it manually',
											)
										}
									}}
									className='border-border/50 hover:bg-muted/50'
								>
									<CopyIcon className='h-4 w-4' />
								</Button>
							</div>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='agentKey' className='text-sm font-medium'>
								Agent Key
							</Label>
							<div className='flex gap-2'>
								<Input
									readOnly
									id='agentKey'
									value={server.agentKey ?? ''}
									className='flex-1 font-mono text-sm bg-muted/50 border-border/50'
								/>
								<Button
									variant='outline'
									size='icon'
									onClick={() => {
										if (navigator.clipboard) {
											navigator.clipboard.writeText(server.agentKey ?? '')
											toast.success('Copied Agent Key to clipboard')
										} else {
											toast.error(
												'Could not copy Agent Key to clipboard - copy it manually',
											)
										}
									}}
									className='border-border/50 hover:bg-muted/50'
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
					<CardFooter className='border-t border-border/50 px-6 py-6'>
						<AnimatedSaveButton mutation={serverMutation} />
					</CardFooter>
				</form>
			</Form>

			<div className='border-t border-border/50'>
				<div className='p-6'>
					<h3 className='text-lg font-semibold text-destructive'>
						Danger Zone
					</h3>
					<p className='text-sm text-muted-foreground/80 mt-1 mb-4'>
						Once you delete a server, there is no going back. Please be certain.
					</p>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant='destructive' className='gap-2'>
								<Trash2Icon className='h-4 w-4' />
								Delete Server
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the
									server and all associated data.
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
				</div>
			</div>
		</Card>
	)
}
