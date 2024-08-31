import { z } from 'zod'

export const projectEnvironmentRouteSchema = z.object({
	'project-uuid': z.string().uuid(),
	'environment-uuid': z.string().uuid(),
})

export type ProjectEnvironmentRouteParams = z.infer<
	typeof projectEnvironmentRouteSchema
>

export function validateRouteParams(
	params: unknown,
): ProjectEnvironmentRouteParams {
	const result = projectEnvironmentRouteSchema.safeParse(params)
	if (!result.success) {
		// Handle validation error
		console.error('Invalid route parameters:', result.error)
		throw new Error('Invalid route parameters')
	}
	return result.data
}
