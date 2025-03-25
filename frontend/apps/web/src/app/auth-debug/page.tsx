'use client'
import { axiosInstance } from '@kubb/plugin-client/clients/axios'
import { useSession } from 'next-auth/react'

export default function Page() {
	const session = useSession()

	const interceptors = axiosInstance.interceptors

	return <pre>{JSON.stringify({ session, interceptors }, null, 2)}</pre>
}
