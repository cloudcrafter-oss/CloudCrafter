import {
	SignIn,
	SignOut,
} from '@/src/app/authjs/components/auth-components.tsx'
import { auth } from '@/src/auth.ts'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Button } from '@ui/components/ui/button.tsx'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu.tsx'

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
