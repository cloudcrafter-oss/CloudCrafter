import { QueryProvider } from '@/src/app/providers/QueryProvider'
import { auth } from '@/src/auth'
import { SessionProvider } from 'next-auth/react'
import type React from 'react'
import { FrontendAxiosProvider } from './FrontendAxiosProvider'

export const CloudCraftProvider = async ({
	children,
}: { children: React.ReactNode }) => {
	const session = await auth()

	return (
		<>
			<SessionProvider basePath={'/api/auth'} session={session}>
				<FrontendAxiosProvider />
				<QueryProvider>{children}</QueryProvider>
			</SessionProvider>
		</>
	)
}
