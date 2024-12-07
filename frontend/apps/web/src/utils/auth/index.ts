import { auth } from '@/src/auth'

export const getCurrentCloudCrafterUser = async () => {
	const session = await auth()

	return session?.user
}
