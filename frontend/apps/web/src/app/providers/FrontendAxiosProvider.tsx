'use client'
import { useEffect, useState } from 'react'

export const FrontendAxiosProvider = () => {
	const [hasSetInterceptors, setHasSetInterceptors] = useState(false)

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
