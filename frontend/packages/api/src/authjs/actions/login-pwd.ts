import type { User } from 'next-auth'
import { postLoginUser } from '../../__generated__'
import { createUserObject } from '../../auth-utils/utils'
import { clientsEnvironment } from '../../client/uniform-environment'

export const loginWithPassword = async (
	email: string,
	password: string,
): Promise<User> => {
	const url = clientsEnvironment.CLOUDCRAFTER_AXIOS_BACKEND_BASEURL
	const result = await postLoginUser(
		{ email, password },
		{
			baseURL: url,
		},
	)
	return createUserObject(result)
}
