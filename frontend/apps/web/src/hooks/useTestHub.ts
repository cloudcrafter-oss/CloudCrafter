import * as signalR from '@microsoft/signalr'
import { useEffect } from 'react'

export const useTestHub = () => {
	useEffect(() => {
		const connection = new signalR.HubConnectionBuilder()
			.withUrl('http://web.127.0.0.1.sslip.io/myHub')
			.build()

		connection.on('ReceiveMessage', (user, message) => {
			console.log('ReceiveMessage', user, message)
		})

		connection.start().catch((err) => console.error(err))

		return () => {
			connection.stop()
		}
	}, [])
}
