import '../styles/tailwind.css'
import { RootProvider } from 'fumadocs-ui/provider'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'

const inter = Inter({
	subsets: ['latin'],
})

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang='en' className={inter.className} suppressHydrationWarning>
			<head>
				<link
					rel='stylesheet'
					href='https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400&display=swap'
				/>
			</head>

			<body className='flex flex-col min-h-screen'>
				<RootProvider>{children}</RootProvider>
			</body>
		</html>
	)
}
