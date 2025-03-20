import { postRefreshTokens } from '@cloudcrafter/api'
import { jwtDecode } from 'jwt-decode'
import type { DecodedJWT } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

export const authJsRefreshAccessToken = async (
	nextAuthJWT: JWT,
): Promise<JWT> => {
	try {
		const response = await postRefreshTokens({
			refreshToken: nextAuthJWT.data.tokens.refresh,
		})

		const { exp }: DecodedJWT = jwtDecode(response.accessToken)

		nextAuthJWT.data.validity.valid_until = exp
		nextAuthJWT.data.tokens.access = response.accessToken
		return { ...nextAuthJWT }
	} catch (error) {
		console.error(error)
		return {
			...nextAuthJWT,
			error: 'RefreshAccessTokenError',
		}
	}
}
