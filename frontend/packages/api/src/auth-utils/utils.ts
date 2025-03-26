import { jwtDecode } from 'jwt-decode'
import type { AuthValidity, DecodedJWT, User, UserObject } from 'next-auth'

import type { TokenDto } from '../__generated__'

export const createUserObject = (result: TokenDto): User => {
	const access: DecodedJWT = jwtDecode(result.accessToken)

	const user: UserObject = {
		name: access.name,
		email: access.email,
		id: access.id,
	}

	const date = new Date(result.refreshTokenExpires)

	// Get the epoch time in milliseconds and convert to seconds
	const epochSeconds = Math.floor(date.getTime() / 1000)

	const validity: AuthValidity = {
		valid_until: access.exp,
		refresh_until: epochSeconds,
	}

	return {
		id: access.jti, // User object is forced to have a string id so use refresh token id
		tokens: {
			access: result.accessToken,
			refresh: result.refreshToken,
		},
		user: user,
		validity: validity,
	} as User
}
