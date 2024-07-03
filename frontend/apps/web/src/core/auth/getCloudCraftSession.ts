import { auth } from '@/src/auth.ts'

export async function getCloudCraftSession() {
    const session = await auth()

    if (session != null) {
        delete session.sessionCloudCraftAccessToken
        delete session.sessionCloudCraftRefreshToken
    }

    console.log('returning session', session)
    return session
}