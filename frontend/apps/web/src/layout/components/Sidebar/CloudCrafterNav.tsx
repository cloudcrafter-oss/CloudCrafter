import { navItems } from '@/src/components/stack-detail/StackConfigPage'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@cloudcrafter/ui/components/collapsible'
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@cloudcrafter/ui/components/sidebar'
import { cn } from '@cloudcrafter/ui/lib/utils'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// UUID regex pattern
const UUID_REGEX =
	/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
// Stack detail path pattern: .../stack/{uuid}
const STACK_DETAIL_PATH_REGEX = new RegExp(
	`/admin/projects/${UUID_REGEX.source}/${UUID_REGEX.source}/stack/${UUID_REGEX.source}$`,
)

function StackConfigNav() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Stack Configuration</SidebarGroupLabel>
			<SidebarMenu>
				{navItems.map((section) => (
					<Collapsible
						key={section.id}
						asChild
						defaultOpen={false}
						className='group/collapsible'
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={section.title}>
									{section.icon && <section.icon />}
									<span>{section.title}</span>
									<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{section.children.map((subTab) => (
										<SidebarMenuSubItem key={subTab.id}>
											<SidebarMenuSubButton asChild>
												<Link
													href={`/stack-config#${section.id}/${subTab.id}`}
													onClick={(e) => {
														e.preventDefault()
														window.location.hash = `${section.id}/${subTab.id}`
													}}
												>
													<span>{subTab.title}</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	)
}

export function CloudCrafterNav({
	items,
}: {
	items: {
		title: string
		url: string
		icon?: LucideIcon
		isActive?: boolean
		items?: {
			title: string
			url: string
		}[]
	}[]
}) {
	const pathname = usePathname()

	// example stackDetail page: admin/projects/5d02d69e-ddd2-4756-8d52-4da58d815a19/dd527b50-5a93-4007-815d-2d18c7aa761b/stack/431ca0d6-5845-42a3-85d1-8ccf74f507ff
	const isStackDetailPage = pathname
		? STACK_DETAIL_PATH_REGEX.test(pathname)
		: false

	return (
		<>
			<div
				className={cn(
					'transition-all duration-300 ease-in-out',
					'overflow-hidden',
					'bg-gradient-to-r from-primary/10 to-primary/5',
					'border-l-4 border-primary/80',
					'shadow-[0_0_15px_rgba(0,0,0,0.1)]',
					'rounded-r-lg',
					'hover:from-primary/15 hover:to-primary/10',
					'hover:shadow-[0_0_20px_rgba(0,0,0,0.15)]',
					'hover:border-primary',
					'group/stack-config',
					isStackDetailPage
						? 'max-h-[1000px] opacity-100'
						: 'max-h-0 opacity-0',
				)}
			>
				<StackConfigNav />
			</div>
			<SidebarGroup>
				<SidebarGroupLabel>Platform</SidebarGroupLabel>
				<SidebarMenu>
					{items.map((item) => (
						<Collapsible
							key={item.title}
							asChild
							defaultOpen={item.isActive}
							className='group/collapsible'
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton tooltip={item.title}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
										<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton asChild>
													<Link href={subItem.url}>
														<span>{subItem.title}</span>
													</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					))}
				</SidebarMenu>
			</SidebarGroup>
		</>
	)
}
