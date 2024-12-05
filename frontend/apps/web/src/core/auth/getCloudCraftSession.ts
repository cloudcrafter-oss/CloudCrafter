import { auth } from '@/src/auth'

export async function getCloudCraftSession() {
	const session = await auth()

	if (session != null) {
		// biome-ignore lint/performance/noDelete: TODO: test if this is still being used
		delete session.sessionCloudCraftAccessToken
		// biome-ignore lint/performance/noDelete: TODO: test if this is still being used
		delete session.sessionCloudCraftRefreshToken
	}

	console.log('returning session', session)
	return session
}
