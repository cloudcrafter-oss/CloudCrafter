import path from 'node:path'
import dotenv from 'dotenv'
import { z } from 'zod'

const schema = z.object({
	BACKEND_URI: z.string().min(1),
	TEST_USER_EMAIL: z.string().min(1),
	TEST_USER_PASSWORD: z.string().min(1),
})

// Get the directory path in a way that works with CommonJS
const envFile = path.resolve(__dirname, '../../.env')
dotenv.config({ path: envFile })

const parseResult = schema.safeParse(process.env)

if (!parseResult.success) {
	const errorMessage = parseResult.error.errors
		.map((x) => `${x.path}: ${x.message}`)
		.join(', ')

	throw new Error(
		`Invalid environment variables. ${errorMessage}. The .env that is being loaded is at ${envFile}`,
	)
}

export const env = parseResult.data
