'use client'
import useIsCollapsed from '@/src/layout/hooks/use-is-collapsed'
import Sidebar from './sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useIsCollapsed()
	return (
		<div className='relative h-full overflow-hidden bg-background'>
			<Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
			<main
				id='content'
				className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
			>
				{children}
			</main>
		</div>
	)
}
