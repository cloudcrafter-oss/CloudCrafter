import { QueryProvider } from '@/src/app/providers/QueryProvider'
import { auth } from '@/src/auth'
import { SessionProvider } from 'next-auth/react'
import type React from 'react'

export const CloudCraftProvider = async ({
	children,
}: { children: React.ReactNode }) => {
	const session = await auth()

	return (
		<>
			<SessionProvider basePath={'/auth'} session={session}>
				<QueryProvider>{children}</QueryProvider>
			</SessionProvider>
		</>
	)
}
