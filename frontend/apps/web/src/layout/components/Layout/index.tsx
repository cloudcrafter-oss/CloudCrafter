import { LayoutHeader } from '@/src/layout/components/Layout/LayoutHeader'
import { LayoutSidebar } from '@/src/layout/components/Layout/LayoutSidebar'
import { LayoutSidebarMobile } from '@/src/layout/components/Layout/LayoutSidebar/LayoutSidebarMobile'
import type React from 'react'

export const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='min-h-screen flex flex-col'>
			<LayoutHeader className='fixed top-0 left-0 right-0 z-50' />
			<div className='flex flex-1 pt-16'>
				<div className='hidden md:block'>
					<LayoutSidebar />
				</div>
				<div className='block md:hidden'>
					<LayoutSidebarMobile />
				</div>
				<main className='flex-1 overflow-y-auto overflow-x-hidden bg-secondary/10 pb-1 px-2 sm:px-4 md:px-6'>
					{children}
				</main>
			</div>
		</div>
	)
}
