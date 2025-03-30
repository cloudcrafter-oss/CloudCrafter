'use client'
import { useSession } from 'next-auth/react'

export default function Page() {
	const session = useSession()

	return <pre>{JSON.stringify({ session }, null, 2)}</pre>
}
