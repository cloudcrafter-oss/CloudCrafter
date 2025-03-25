import { z } from 'zod'

// Define schema for Auth0 environment variables
const auth0EnvSchema = z.object({
	AUTH_AUTH0_ID: z.string().min(1),
	AUTH_AUTH0_SECRET: z.string().min(1),
	AUTH_AUTH0_ISSUER: z.string().url(),
})

const credentialsEnvSchema = z.object({
	AUTH_CREDENTIALS_ENABLED: z.string().transform((val) => val === 'true'),
})

// Define schema for NextAuth environment variables
const nextAuthEnvSchema = z.object({
	NEXTAUTH_URL: z.string().url().optional(),
	NEXTAUTH_SECRET: z.string().min(1).optional(),
})

// Validate environment variables
export const validateEnv = () => {
	// For Auth0 - this is optional, so we use safeParse
	const auth0Result = auth0EnvSchema.safeParse({
		AUTH_AUTH0_ID: process.env.AUTH_AUTH0_ID,
		AUTH_AUTH0_SECRET: process.env.AUTH_AUTH0_SECRET,
		AUTH_AUTH0_ISSUER: process.env.AUTH_AUTH0_ISSUER,
	})

	const credentialsResult = credentialsEnvSchema.safeParse({
		AUTH_CREDENTIALS_ENABLED: process.env.AUTH_CREDENTIALS_ENABLED,
	})

	// For NextAuth - this is required, so we use parse (will throw if invalid)
	try {
		nextAuthEnvSchema.parse({
			NEXTAUTH_URL: process.env.NEXTAUTH_URL,
			NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		})
	} catch (error) {
		console.error('NextAuth environment validation failed:', error)
		// In production, you might want to handle this differently
	}

	return {
		auth0Enabled: auth0Result.success,
		auth0Config: auth0Result.success ? auth0Result.data : null,
		credentialsEnabled: credentialsResult.success,

		credentialsConfig: credentialsResult.success
			? credentialsResult.data.AUTH_CREDENTIALS_ENABLED
			: null,
	}
}
