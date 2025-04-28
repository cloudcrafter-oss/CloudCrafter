'use client'
import { Spinner } from '@cloudcrafter/ui/components/spinner'
import { useEffect, useState } from 'react'

interface ConfigProviderProps {
	children: React.ReactNode
}

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
	const [isLoading, setIsLoading] = useState(true)

	const [isError, setIsError] = useState(false)

	useEffect(() => {
		fetch('/api/config')
			.then((response) => response.json())
			.then((data) => {
				if (localStorage) {
					localStorage.setItem('cloudcrafter-config', JSON.stringify(data))
				}
				setIsLoading(false)
			})
			.catch((error) => {
				console.error('Failed to fetch config:', error)

				setIsError(true)
			})
	}, [])

	if (isError) {
		return (
			<div className='flex items-center justify-center w-full h-full min-h-[50vh]'>
				<p>Failed to fetch config</p>
			</div>
		)
	}
	if (isLoading) {
		return (
			<div className='flex items-center justify-center w-full h-full min-h-[50vh]'>
				<Spinner className='w-8 h-8' />
			</div>
		)
	}

	return <>{children}</>
}
