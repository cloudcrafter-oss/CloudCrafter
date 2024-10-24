import * as signalR from '@microsoft/signalr'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import type { DeploymentLogDto } from '../core/__generated__'

export const useWebHub = ({ channelId }: { channelId: string }) => {
	const { data: session } = useSession()

	const [messages, setMessages] = useState<DeploymentLogDto[]>([])

	useEffect(() => {
		const connection = new signalR.HubConnectionBuilder()
			.withUrl('http://web.127.0.0.1.sslip.io/hub/web', {
				accessTokenFactory: () => {
					return session?.accessToken || ''
				},
			})
			.withAutomaticReconnect()
			.build()

		console.log('rendering now')
		connection.on('DeploymentOutput', (message: DeploymentLogDto) => {
			setMessages((prev) => [...prev, message])
		})

		connection
			.start()
			.then(() => {
				connection.invoke('JoinChannel', channelId)
			})
			.catch((err) => console.error(err))

		return () => {
			try {
				connection.stop()
			} catch (err) {
				console.error(err)
			}
		}
	}, [session?.accessToken, channelId])

	return {
		messages,
	}
}
