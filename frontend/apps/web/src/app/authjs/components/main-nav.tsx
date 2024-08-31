'use client'
import CustomLink from '@/src/app/authjs/components/custom-link.tsx'

import { Button } from '@ui/components/ui/button.tsx'
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@ui/components/ui/navigation-menu.tsx'
import { cn } from '@ui/lib/utils.ts'
import React from 'react'

export function MainNav() {
	return (
		<div className='flex gap-4 items-center'>
			<CustomLink href='/'>
				<Button variant='ghost' className='p-0' />
			</CustomLink>
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger className='px-2'>
							Server Side
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
								<ListItem href='/authjs/server-example' title='RSC Example'>
									Protecting React Server Component.
								</ListItem>
								<ListItem
									href='/authjs/middleware-example'
									title='Middleware Example'
								>
									Using Middleware to protect pages & APIs.
								</ListItem>
								<ListItem
									href='/authjs/api-example'
									title='Route Handler Example'
								>
									Getting the session inside an API Route.
								</ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink
							href='/authjs/client-example'
							className={navigationMenuTriggerStyle()}
						>
							Client Side
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	)
}

const ListItem = React.forwardRef<
	React.ElementRef<'a'>,
	React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
						className,
					)}
					{...props}
				>
					<div className='text-sm font-medium leading-none'>{title}</div>
					<p className='text-sm leading-snug line-clamp-2 text-muted-foreground'>
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	)
})
ListItem.displayName = 'ListItem'
