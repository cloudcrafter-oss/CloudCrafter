import { z } from 'zod'

export const projectEnvironmentRouteSchema = z.object({
	'project-uuid': z.string().uuid(),
	'environment-uuid': z.string().uuid(),
})

export const stackRouteSchema = z.object({
	'stack-uuid': z.string().uuid(),
})

export type ProjectEnvironmentRouteParams = z.infer<
	typeof projectEnvironmentRouteSchema
>
export type StackRouteParams = z.infer<typeof stackRouteSchema>

export function validateProjectEnvironmentRouteParams(
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

export function validateStackRouteParams(params: unknown): StackRouteParams {
	const result = stackRouteSchema.safeParse(params)
	if (!result.success) {
		// Handle validation error
		console.error('Invalid route parameters:', result.error)
		throw new Error('Invalid route parameters')
	}

	return result.data
}
