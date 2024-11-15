import { CloudCrafterSidebar } from '@/src/layout/components/Sidebar/CloudCrafterSidebar'
import { ThemeProvider } from '@/src/layout/components/theme-provider.tsx'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@ui/components/ui/breadcrumb.tsx'
import { Separator } from '@ui/components/ui/separator.tsx'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@ui/components/ui/sidebar.tsx'
import { TooltipProvider } from '@ui/components/ui/tooltip.tsx'
import type React from 'react'

export default function NextAdminLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<ThemeProvider defaultTheme={'dark'} storageKey={'cloudCraft-theme'}>
			<TooltipProvider>
				{/* <Layout>{children}</Layout> */}
				<SidebarProvider>
					<CloudCrafterSidebar />
					<SidebarInset>
						<header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
							<div className='flex items-center gap-2 px-4'>
								<SidebarTrigger className='-ml-1' />
								<Separator orientation='vertical' className='mr-2 h-4' />
								<Breadcrumb>
									<BreadcrumbList>
										<BreadcrumbItem className='hidden md:block'>
											<BreadcrumbLink href='#'>
												Building Your Application
											</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator className='hidden md:block' />
										<BreadcrumbItem>
											<BreadcrumbPage>Data Fetching</BreadcrumbPage>
										</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</div>
						</header>
						<div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
							{children}
						</div>
					</SidebarInset>
				</SidebarProvider>
			</TooltipProvider>
		</ThemeProvider>
	)
}
