'use client'
import { LayoutSidebarMobile } from '@/src/layout/components/Layout/LayoutSidebar/LayoutSidebarMobile'
import { ThemeToggle } from '@/src/layout/components/ThemeToggle'
import { UserNav } from '@/src/layout/components/UserNav'
import { Button } from '@cloudcrafter/ui/components/button'
import { cn } from '@cloudcrafter/ui/lib/utils'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export const LayoutHeader = () => {
	const { data: sessionData } = useSession()
	return (
		<div className='supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur'>
			<nav className='flex h-16 items-center justify-between px-4'>
				<Link
					href={'/admin'}
					className='hidden items-center justify-between gap-2 md:flex'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 256 256'
						className={'transition-all h-8 w-8'}
					>
						<rect width='256' height='256' fill='none' />
						<line
							x1='208'
							y1='128'
							x2='128'
							y2='208'
							fill='none'
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='16'
						/>
						<line
							x1='192'
							y1='40'
							x2='40'
							y2='192'
							fill='none'
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='16'
						/>
						<span className='sr-only'>Website Name</span>
					</svg>
					<div className={'flex flex-col justify-end truncate visible w-auto'}>
						<span className='font-medium'>CloudCrafter</span>
						<span className='text-xs'>Admin Panel</span>
					</div>
				</Link>
				<div className={cn('block md:!hidden')}>
					<LayoutSidebarMobile />
				</div>

				<div className='flex items-center gap-2'>
					<ThemeToggle />
					{sessionData?.user ? (
						<UserNav user={sessionData.user} />
					) : (
						<Button
							size='sm'
							onClick={() => {
								alert('login')
								//void signIn();
							}}
						>
							Sign In
						</Button>
					)}
				</div>
			</nav>
		</div>
	)
}
