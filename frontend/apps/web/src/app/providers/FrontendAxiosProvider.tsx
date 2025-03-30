'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const FrontendAxiosProvider = () => {
	const [hasSetInterceptors, setHasSetInterceptors] = useState(false)

	const { status } = useSession()

	useEffect(() => {
		if (status !== 'authenticated') {
			console.log('SIGNING OUT')
			//	signOut()
		}
	}, [status])

	useEffect(() => {
		if (hasSetInterceptors) return

		// frontendAxiosInstance.interceptors.request.use(async (request) => {
		// 	const session = await getSession()

		// 	if (session) {
		// 		request.headers.Authorization = `Bearer ${session.t.accessToken}`
		// 	}

		// 	return request
		// })

		setHasSetInterceptors(true)
	}, [hasSetInterceptors])

	return <></>
}
