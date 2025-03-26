import type { User } from 'next-auth'
import { postCreateUser } from '../../__generated__'
import { createUserObject } from '../../auth-utils/utils'
import { clientsEnvironment } from '../../client/uniform-environment'
export const loginWithOidc = async (
	name: string,
	email: string,
): Promise<User> => {
	const url = clientsEnvironment.CLOUDCRAFTER_AXIOS_BACKEND_BASEURL

	const result = await postCreateUser({ name, email }, { baseURL: url })

	return createUserObject(result)
}
