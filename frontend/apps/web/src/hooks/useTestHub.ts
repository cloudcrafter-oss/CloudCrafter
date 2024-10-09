import type { MyHubMessage } from '@/src/core/__generated__/signal-types/my-hub-message.ts'
import * as signalR from '@microsoft/signalr'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export const useTestHub = () => {
	const { data: session } = useSession()

	useEffect(() => {
		const connection = new signalR.HubConnectionBuilder()
			.withUrl('http://web.127.0.0.1.sslip.io/hub/web', {
				accessTokenFactory: () => {
					return session?.accessToken || ''
				},
			})
			.build()

		console.log('rendering now')
		connection.on('DeploymentOutput', (message: MyHubMessage) => {
			console.log('ReceiveMessage', message)
			console.log('Id is ', message.id)
		})

		connection.start().catch((err) => console.error(err))

		return () => {
			connection.stop()
		}
	}, [session?.accessToken])
}
