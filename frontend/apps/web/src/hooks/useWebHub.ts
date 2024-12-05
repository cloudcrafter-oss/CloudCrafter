import * as signalR from '@microsoft/signalr'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import type { DeploymentLogDto } from '@cloudcrafter/api/__generated__/types/DeploymentLogDto'
import { backendEnv } from '../core/env/cloudcrafter-env'

export const useWebHub = ({ channelId }: { channelId: string }) => {
	const { data: session } = useSession()

	const [messages, setMessages] = useState<DeploymentLogDto[]>([])

	useEffect(() => {
		const host = backendEnv.CLOUDCRAFTER_AXIOS_BACKEND_BASEURL
		const connection = new signalR.HubConnectionBuilder()
			.withUrl(`${host}/hub/web`, {
				accessTokenFactory: () => {
					return session?.accessToken || ''
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
	}, [session?.accessToken, channelId])

	return {
		messages,
	}
}
