import { z } from 'zod'

const backendEnvSchema = z.object({
	CLOUDCRAFTER_AXIOS_BACKEND_BASEURL: z.string().url(),
})

const isServer = typeof window === 'undefined'

let localConfig: { backendUrl?: string } | null = null
if (!isServer && window.localStorage) {
	const config = localStorage.getItem('cloudcrafter-config')
	if (config) {
		localConfig = JSON.parse(config)
	}
}

export const backendEnv = backendEnvSchema.parse(
	isServer
		? process.env
		: localConfig?.backendUrl
			? {
					CLOUDCRAFTER_AXIOS_BACKEND_BASEURL: localConfig.backendUrl,
				}
			: {}
)
