import { ThemeProvider } from '@/src/layout/components/theme-provider.tsx'

import { Layout } from '@/src/layout/components/Layout'
import { TooltipProvider } from '@ui/components/ui/tooltip.tsx'
import type React from 'react'

export default function NextAdminLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<ThemeProvider defaultTheme={'dark'} storageKey={'cloudCraft-theme'}>
			<TooltipProvider>
				s<Layout>{children}</Layout>
			</TooltipProvider>
		</ThemeProvider>
	)
}
