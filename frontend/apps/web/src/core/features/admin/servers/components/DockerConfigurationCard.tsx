import type { ServerDetailDto } from '@cloudcrafter/api'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@cloudcrafter/ui/components/card'
import { Input } from '@cloudcrafter/ui/components/input'
import { Label } from '@cloudcrafter/ui/components/label'
import { ContainerIcon, RefreshCwIcon } from 'lucide-react'

interface DockerConfigurationCardProps {
	server: ServerDetailDto
}

export const DockerConfigurationCard = ({
	server,
	onSubmit,
}: DockerConfigurationCardProps) => {
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
			<form onSubmit={onSubmit}>
				<CardContent className='grid gap-6'>
					<div className='grid gap-2'>
						<Label htmlFor='dockerNetwork' className='text-sm font-medium'>
							Docker Network Name
						</Label>
						<Input
							id='dockerNetwork'
							name='dockerNetwork'
							defaultValue={server.dockerNetworkName ?? ''}
							placeholder='Leave empty to use default network'
							className='bg-muted/50 border-border/50 focus-visible:ring-primary/20'
						/>
						<p className='text-sm text-muted-foreground/80'>
							The name of the Docker network to use for container communication.
							Leave empty to use the default network.
						</p>
					</div>
				</CardContent>
				<CardFooter className='border-t border-border/50 px-6 py-6'>
					<Button type='submit' className='gap-2 px-8' variant='default'>
						<RefreshCwIcon className='h-4 w-4' />
						Save Changes
					</Button>
				</CardFooter>
			</form>
		</Card>
	)
}
