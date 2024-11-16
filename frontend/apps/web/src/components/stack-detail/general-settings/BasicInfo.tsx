'use client'
import {
	type StackDetailDto,
	updateStackMutationRequestSchema,
	useDispatchStackDeploymentHook,
	useUpdateStackHook,
} from '@/src/core/__generated__'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@ui/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@ui/components/ui/form'
import { Input } from '@ui/components/ui/input'
import { Label } from '@ui/components/ui/label'
import { Switch } from '@ui/components/ui/switch'
import { Textarea } from '@ui/components/ui/textarea'
import {
	FileText,
	MoreVertical,
	PencilIcon,
	RefreshCw,
	Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { EntityHealthBadge } from '../../badges/EntityHealthBadge'
import { ChannelLogViewerEnhanced } from '../../logviewer/ChannelLogViewer'

export const BasicInfo = ({
	stackDetails,
}: { stackDetails: StackDetailDto }) => {
	const [isEditing, setIsEditing] = useState(false)

	const { mutateAsync } = useDispatchStackDeploymentHook()
	const handleDeploy = async () => {
		const deploymentCreatedDto = await mutateAsync({ id: stackDetails.id })
		setLogChannelId(deploymentCreatedDto.deploymentId)
	}

	const [logChannelId, setLogChannelId] = useState<string | null>(null)

	const form = useForm<z.infer<typeof updateStackMutationRequestSchema>>({
		resolver: zodResolver(updateStackMutationRequestSchema),
		defaultValues: {
			stackId: stackDetails.id,
			name: stackDetails.name,
			description: stackDetails.description,
		},
	})

	const formValues = form.watch()

	const updateDetailMutation = useUpdateStackHook()

	const onSubmitBasicInfo = async (
		values: z.infer<typeof updateStackMutationRequestSchema>,
	) => {
		await updateDetailMutation.mutateAsync({
			id: stackDetails.id,
			data: values,
		})

		setIsEditing(false)
		toast.success('Stack has been updated!')
	}

	return (
		<div className='space-y-6'>
			<Card>
				<CardHeader className='relative'>
					<CardTitle>Stack Information</CardTitle>
					<CardDescription>Basic details about your Stack</CardDescription>
					<div className='absolute top-4 right-4 flex items-center space-x-2'>
						<EntityHealthBadge
							blink
							statusAt={stackDetails.health.statusAt}
							status={stackDetails.health.value}
						/>
						{/* <Badge variant='destructive'>{stackDetails.health.value}</Badge> */}

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='ghost' size='icon'>
									<MoreVertical className='h-4 w-4' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={handleDeploy}>
									<RefreshCw className='mr-2 h-4 w-4' />
									Deploy now
								</DropdownMenuItem>
								<DropdownMenuItem>
									<FileText className='mr-2 h-4 w-4' />
									View Logs
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Trash2 className='mr-2 h-4 w-4' />
									Delete Stack
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setIsEditing(!isEditing)}
						>
							<PencilIcon className='h-4 w-4' />
						</Button>
					</div>
				</CardHeader>
				<ChannelLogViewerEnhanced
					channelId={logChannelId || ''}
					show={logChannelId != null}
					onHide={() => setLogChannelId(null)}
				/>
				<CardContent className='space-y-4'>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmitBasicInfo)}
							className='space-y-4'
						>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem className='space-y-2'>
										<FormLabel htmlFor='stack-name'>Stack Name</FormLabel>
										{isEditing ? (
											<FormControl>
												<Input
													// placeholder={stackDetails.name || ''}
													{...field}
													value={field.value ?? ''}
												/>
											</FormControl>
										) : (
											<div className='p-2 bg-muted rounded-md'>
												{stackDetails.name}
											</div>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem className='space-y-2'>
										<FormLabel htmlFor='stack-description'>
											Description
										</FormLabel>
										{isEditing ? (
											<FormControl>
												<Textarea
													id='stack-description'
													placeholder='Describe your stack...'
													{...field}
													value={field.value ?? ''}
												/>
											</FormControl>
										) : (
											<div className='p-2 bg-muted rounded-md'>
												{stackDetails.description || 'No description provided'}
											</div>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>

							<pre className='p-4 bg-muted rounded-md overflow-auto'>
								{JSON.stringify(formValues, null, 2)}
							</pre>

							{isEditing && (
								<div className='flex justify-end space-x-2'>
									<Button type='submit'>Save Changes</Button>
								</div>
							)}
						</form>
					</Form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Environment Variables</CardTitle>
					<CardDescription>
						Configure environment variables for your stack
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{/* Add a component for managing env variables */}
					<Button>Add Environment Variable</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Network Configuration</CardTitle>
					<CardDescription>
						Set up networking for your Docker stack
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='flex items-center space-x-2'>
						<Switch id='use-custom-network' />
						<Label htmlFor='use-custom-network'>Use Custom Network</Label>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='network-name'>Network Name</Label>
						<Input id='network-name' placeholder='my-custom-network' />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Volume Configuration</CardTitle>
					<CardDescription>
						Manage persistent storage for your stack
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{/* Add a component for managing volumes */}
					<Button>Add Volume</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Deployment Settings</CardTitle>
					<CardDescription>
						Configure deployment options for your stack
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='flex items-center space-x-2'>
						<Switch id='enable-rolling-updates' />
						<Label htmlFor='enable-rolling-updates'>
							Enable Rolling Updates
						</Label>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='replicas'>Number of Replicas</Label>
						<Input id='replicas' type='number' min='1' defaultValue='1' />
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
