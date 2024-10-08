import CustomLink from '@/src/app/authjs/components/custom-link.tsx'
import SessionData from '@/src/app/authjs/components/session-data.tsx'
import { auth } from '@/src/auth.ts'

export default async function Page() {
	const session = await auth()
	return (
		<div className='space-y-2'>
			<h1 className='text-3xl font-bold'>React Server Component Usage</h1>
			<p>
				This page is server-rendered as a{' '}
				<CustomLink href='https://nextjs.org/docs/app/building-your-application/rendering/server-components'>
					React Server Component
				</CustomLink>
				. It gets the session data on the server using{' '}
				<CustomLink href='https://nextjs.authjs.dev#auth'>
					<code>auth()</code>
				</CustomLink>{' '}
				method.
			</p>
			<pre>{JSON.stringify({ session }, null, 2)}</pre>
			<SessionData session={session} />
		</div>
	)
}
