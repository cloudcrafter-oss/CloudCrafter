import { auth } from '@/src/auth.ts'

export const getCurrentCloudCrafterUser = async () => {
	const session = await auth()

	return session?.user
}
