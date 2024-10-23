import type { DeploymentOutputArgs } from '@/src/core/__generated__/signal-types/deployment-output-args'
import * as signalR from '@microsoft/signalr'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useWebHub = ({ channelId }: { channelId: string }) => {
	const { data: session } = useSession()

	const [messages, setMessages] = useState<DeploymentOutputArgs[]>([])

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
		connection.on('DeploymentOutput', (message: DeploymentOutputArgs) => {
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
