import * as signalR from '@microsoft/signalr'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import type { DeploymentLogDto } from '@cloudcrafter/api'
import { clientsEnvironment } from '@cloudcrafter/api/uniform-environment'

export const useWebHub = ({ channelId }: { channelId: string }) => {
	const { data: session } = useSession()

	const [messages, setMessages] = useState<DeploymentLogDto[]>([])

	useEffect(() => {
		const host = clientsEnvironment.CLOUDCRAFTER_AXIOS_BACKEND_BASEURL
		const connection = new signalR.HubConnectionBuilder()
			.withUrl(`${host}/hub/web`, {
				accessTokenFactory: () => {
					return session?.tokens?.access || ''
				},
			})
			.withAutomaticReconnect()
			.build()

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
	}, [session?.tokens?.access, channelId])

	return {
		messages,
	}
}
