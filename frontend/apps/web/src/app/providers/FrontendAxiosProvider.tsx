'use client'
import { setupGlobalInterceptors } from '@/src/setup-client'
import { useEffect, useState } from 'react'

export const FrontendAxiosProvider = () => {
	const [hasSetInterceptors, setHasSetInterceptors] = useState(false)

	useEffect(() => {
		if (hasSetInterceptors) return

		setupGlobalInterceptors()

		setHasSetInterceptors(true)
	}, [hasSetInterceptors])

	return <></>
}
