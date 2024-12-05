import { SignIn, SignOut } from '@/src/app/authjs/components/auth-components'
import { auth } from '@/src/auth'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@cloudcrafter/ui/components/dropdown-menu'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'

export default async function UserButton() {
	const session = await auth()
	if (!session?.user) return <SignIn />
	return (
		<div className='flex gap-2 items-center'>
			<span className='hidden text-sm sm:inline-flex'>
				{session.user.email}
			</span>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='relative w-8 h-8 rounded-full'>
						<Avatar className='w-8 h-8'>
							<AvatarImage
								src={
									session.user.image ??
									'https://source.boringavatars.com/marble/120'
								}
								alt={session.user.name ?? ''}
							/>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-56' align='end' forceMount>
					<DropdownMenuLabel className='font-normal'>
						<div className='flex flex-col space-y-1'>
							<p className='text-sm font-medium leading-none'>
								{session.user.name}
							</p>
							<p className='text-xs leading-none text-muted-foreground'>
								{session.user.email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuItem>
						<SignOut />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
