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
import { CircleIcon, CopyIcon, RefreshCwIcon, ServerIcon } from 'lucide-react'
import { toast } from 'sonner'

interface GeneralSettingsCardProps {
	server: ServerDetailDto
}

export const GeneralSettingsCard = ({
	server,
	onSubmit,
}: GeneralSettingsCardProps) => {
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
			<form onSubmit={onSubmit}>
				<CardContent className='grid gap-6'>
					<div className='grid gap-2'>
						<Label htmlFor='name' className='text-sm font-medium'>
							Name
						</Label>
						<Input
							id='name'
							name='name'
							defaultValue={server.name}
							className='bg-muted/50 border-border/50 focus-visible:ring-primary/20'
						/>
					</div>
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
									navigator.clipboard.writeText(server.id)
									toast.success('Copied Agent ID to clipboard')
								}}
								className='border-border/50 hover:bg-muted/50'
							>
								<CopyIcon className='h-4 w-4' />
							</Button>
						</div>
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
