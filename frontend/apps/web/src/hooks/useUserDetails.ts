import type { UserObject } from 'next-auth'
import { useSession } from 'next-auth/react'

interface NotLoggedIn {
	loggedIn: false
}

interface LoggedIn {
	loggedIn: true
	user: UserObject
	initials: string
}

export const useUserDetails = (): NotLoggedIn | LoggedIn => {
	const { data } = useSession()

	const loggedIn = !!data?.user

	if (!loggedIn || !data?.user) {
		return { loggedIn: false }
	}

	const initials = data.user.name
		.split(' ')
		.map((name) => name[0].toUpperCase())
		.join('')
	return {
		loggedIn,
		user: data.user,
		initials,
	}
}
