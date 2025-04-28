'use client'

import {
	usePostDispatchStackDeploymentHook,
	useUpdateStackHook,
} from '@cloudcrafter/api'
import type { StackDetailDto } from '@cloudcrafter/api'
import { updateStackMutationRequestSchema } from '@cloudcrafter/api'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@cloudcrafter/ui/components/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@cloudcrafter/ui/components/dropdown-menu'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@cloudcrafter/ui/components/form'
import { Input } from '@cloudcrafter/ui/components/input'
import { Textarea } from '@cloudcrafter/ui/components/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
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

	const { mutateAsync } = usePostDispatchStackDeploymentHook()
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

							{isEditing && (
								<div className='flex justify-end space-x-2'>
									<Button type='submit'>Save Changes</Button>
								</div>
							)}
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
