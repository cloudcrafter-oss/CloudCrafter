import { z } from 'zod'

const backendEnvSchema = z.object({
	CLOUDCRAFTER_AXIOS_BACKEND_BASEURL: z.string().url(),
})

const isServer = typeof window === 'undefined'

if(isServer) {
    console.log(process.env.NEXT_PUBLIC_CLOUDCRAFTER_AXIOS_BACKEND_BASEURL)
}

export const backendEnv = backendEnvSchema.parse(
	isServer
		? process.env
		: process.env.NEXT_PUBLIC_CLOUDCRAFTER_AXIOS_BACKEND_BASEURL
			? {
					CLOUDCRAFTER_AXIOS_BACKEND_BASEURL:
						process.env.NEXT_PUBLIC_CLOUDCRAFTER_AXIOS_BACKEND_BASEURL,
				}
			: {},
)
