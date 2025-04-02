import {
	type ServerDetailDto,
	updateServerDtoSchema,
	useUpdateServerHook,
} from '@cloudcrafter/api'
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
import { ContainerIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
