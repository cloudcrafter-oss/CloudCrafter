import {
	type ServerDetailDto,
	updateServerDtoSchema,
	useUpdateServerHook,
} from '@cloudcrafter/api'
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
import { AnimatedSaveButton } from '@cloudcrafter/ui/custom-components/animated-save-button'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	CheckIcon,
	ContainerIcon,
	Loader2Icon,
	RefreshCwIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

interface DockerConfigurationCardProps {
	server: ServerDetailDto
}
const schema = updateServerDtoSchema
	.pick({
		dockerNetwork: true,
	})
	.required()
	.refine((data) => data.dockerNetwork && data.dockerNetwork.length >= 1, {
		message: 'Docker network name is required',
		path: ['dockerNetwork'],
	})

interface SubmitButtonProps {
	isPending: boolean
	isSuccess: boolean
	onReset: () => void
}

const SubmitButton = ({ isPending, isSuccess, onReset }: SubmitButtonProps) => {
	useEffect(() => {
		if (isSuccess) {
			const timer = setTimeout(() => {
				onReset()
			}, 2000)
			return () => clearTimeout(timer)
		}
	}, [isSuccess, onReset])

	return (
		<Button
			type='submit'
			className='gap-2 px-8'
			variant='default'
			disabled={isPending}
		>
			<div className='relative h-4 w-4'>
				<div
					className={`absolute inset-0 transition-opacity duration-200 ${isPending ? 'opacity-100' : 'opacity-0'}`}
				>
					<Loader2Icon className='h-4 w-4 animate-spin' />
				</div>
				<div
					className={`absolute inset-0 transition-opacity duration-200 ${isSuccess ? 'opacity-100' : 'opacity-0'}`}
				>
					<CheckIcon className='h-4 w-4' />
				</div>
				<div
					className={`absolute inset-0 transition-opacity duration-200 ${!isPending && !isSuccess ? 'opacity-100' : 'opacity-0'}`}
				>
					<RefreshCwIcon className='h-4 w-4' />
				</div>
			</div>
			<div className='relative w-24 flex items-center justify-center'>
				<div
					className={`absolute transition-opacity duration-200 ${isPending ? 'opacity-100' : 'opacity-0'}`}
				>
					Saving...
				</div>
				<div
					className={`absolute transition-opacity duration-200 ${isSuccess ? 'opacity-100' : 'opacity-0'}`}
				>
					Saved
				</div>
				<div
					className={`absolute transition-opacity duration-200 ${!isPending && !isSuccess ? 'opacity-100' : 'opacity-0'}`}
				>
					Save Changes
				</div>
			</div>
		</Button>
	)
}

export const DockerConfigurationCard = ({
	server,
}: DockerConfigurationCardProps) => {
	const router = useRouter()
	const serverMutation = useUpdateServerHook({
		mutation: {
			onSuccess: () => {
				toast.success('Docker network updated successfully')
				router.refresh()
			},
		},
	})

	const dockerForm = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			dockerNetwork: server.dockerNetworkName,
		},
	})

	const onSubmit = (data: z.infer<typeof schema>) => {
		serverMutation.mutate({
			id: server.id,
			data: {
				dockerNetwork: data.dockerNetwork,
			},
		})
	}

	return (
		<Card className='bg-card/50 backdrop-blur-sm border-border/50'>
			<CardHeader className='pb-4'>
				<div className='flex items-center gap-3'>
					<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20'>
						<ContainerIcon className='h-5 w-5 text-primary' />
					</div>
					<div>
						<CardTitle className='text-xl'>Docker Configuration</CardTitle>
						<CardDescription className='text-muted-foreground/80'>
							Configure Docker-specific settings for this server.
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<Form {...dockerForm}>
				<form
					onSubmit={dockerForm.handleSubmit(onSubmit)}
					className='flex flex-col gap-4'
				>
					<CardContent className='grid gap-6'>
						<FormField
							control={dockerForm.control}
							name='dockerNetwork'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Default Docker Network Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											value={field.value || ''}
											className='bg-muted/50 border-border/50 focus-visible:ring-primary/20'
											placeholder='Enter docker network name'
										/>
									</FormControl>
									<p className='text-sm text-muted-foreground/80'>
										The name of the Default Docker network to use for container
										communication. Leave empty to use the default network.
									</p>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter className='border-t border-border/50 px-6 py-6'>
						<AnimatedSaveButton mutation={serverMutation} />
					</CardFooter>
				</form>
			</Form>
		</Card>
	)
}
