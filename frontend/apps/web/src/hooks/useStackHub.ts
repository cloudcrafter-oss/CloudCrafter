import * as signalR from '@microsoft/signalr'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { EntityHealthDto, StackDetailDto } from '../core/__generated__'
import { formatDate } from '../utils/date/date-utils'
import { backendEnv } from '../core/env/cloudcrafter-env'

export const useStackHub = ({
	initialStack,
}: { initialStack: StackDetailDto }) => {
	const { data: session } = useSession()

	const [stack, setStack] = useState(initialStack)

	useEffect(() => {
		const host = backendEnv.CLOUDCRAFTER_AXIOS_BACKEND_BASEURL
		const connection = new signalR.HubConnectionBuilder()
			.withUrl(`${host}/hub/stack`, {
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

			setStack({ ...stack, health: update })
		})

		connection.on('StackUpdated', (update: StackDetailDto) => {
			setStack(update)
		})

		connection
			.start()
			.then(() => {
				connection.invoke('JoinChannel', stack.id)
			})
			.catch((err) => console.error(err))

		return () => {
			try {
				connection.stop()
			} catch (err) {
				console.error(err)
			}
		}
	}, [session?.accessToken, stack])

	return {
		stack,
	}
}
