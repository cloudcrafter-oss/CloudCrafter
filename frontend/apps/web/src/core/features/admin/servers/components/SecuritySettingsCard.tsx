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
import { RefreshCwIcon, ShieldIcon } from 'lucide-react'
interface SecuritySettingsCardProps {
	server: ServerDetailDto
}

export const SecuritySettingsCard = ({ server }: SecuritySettingsCardProps) => {
	return (
		<Card className='bg-card/50 backdrop-blur-sm border-border/50'>
			<CardHeader className='pb-4'>
				<div className='flex items-center gap-3'>
					<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20'>
						<ShieldIcon className='h-5 w-5 text-primary' />
					</div>
					<div>
						<CardTitle className='text-xl'>Security Settings</CardTitle>
						<CardDescription className='text-muted-foreground/80'>
							Configure security-related settings for this server.
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent className='grid gap-6'>
				<div className='grid gap-2'>
					<Label htmlFor='sshKey' className='text-sm font-medium'>
						SSH Key
					</Label>
					<Input
						id='sshKey'
						name='sshKey'
						defaultValue={''}
						placeholder='Enter your SSH key'
						className='bg-muted/50 border-border/50 focus-visible:ring-primary/20'
					/>
					<p className='text-sm text-muted-foreground/80'>
						The SSH key used to authenticate with the server.
					</p>
				</div>
				<div className='grid gap-2'>
					<Label htmlFor='sshPort' className='text-sm font-medium'>
						SSH Port
					</Label>
					<Input
						id='sshPort'
						name='sshPort'
						type='number'
						defaultValue={22}
						placeholder='22'
						className='bg-muted/50 border-border/50 focus-visible:ring-primary/20'
					/>
					<p className='text-sm text-muted-foreground/80'>
						The port used for SSH connections.
					</p>
				</div>
			</CardContent>
			<CardFooter className='border-t border-border/50 px-6 py-6'>
				<Button type='submit' className='gap-2 px-8' variant='default'>
					<RefreshCwIcon className='h-4 w-4' />
					Save Changes
				</Button>
			</CardFooter>
		</Card>
	)
}
