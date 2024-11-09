import * as signalR from '@microsoft/signalr'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { EntityHealthDto } from '../core/__generated__'
import { formatDate } from '../utils/date/date-utils'

export const useStackHub = ({ stackId }: { stackId: string }) => {
	const { data: session } = useSession()

	const [lastUpdate, setLastUpdate] = useState<EntityHealthDto | null>(null)

	useEffect(() => {
		const connection = new signalR.HubConnectionBuilder()
			.withUrl('http://web.127.0.0.1.sslip.io/hub/stack', {
				accessTokenFactory: () => {
					return session?.accessToken || ''
				},
			})
			.withAutomaticReconnect()
			.build()

		connection.on('StackHealthUpdate', (update: EntityHealthDto) => {
			const formattedDate = formatDate(update.statusAt || '')

			if (update.value === 'Healthy') {
				toast.success(`Stack is healthy at ${formattedDate}`)
			} else if (update.value === 'Unhealthy') {
				toast.error(`Stack is unhealthy at ${formattedDate}`)
			} else if (update.value === 'Degraded') {
				toast.warning(`Stack is degraded at ${formattedDate}`)
			} else {
				toast.info(`Stack status is unknown at ${update.statusAt}`)
			}

			setLastUpdate(update)
		})

		connection
			.start()
			.then(() => {
				connection.invoke('JoinChannel', stackId)
			})
			.catch((err) => console.error(err))

		return () => {
			try {
				connection.stop()
			} catch (err) {
				console.error(err)
			}
		}
	}, [session?.accessToken, stackId])

	return {
		lastUpdate,
	}
}
