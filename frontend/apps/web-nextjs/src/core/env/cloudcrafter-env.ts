import { z } from 'zod'

const backendEnvSchema = z.object({
    CLOUDCRAFTER_AXIOS_BACKEND_BASEURL: z.string().url()
})

export const backendEnv = backendEnvSchema.parse(process.env)