import { z } from 'zod'

export const postCreateDeploymentPathParamsSchema = z.object({
	applicationId: z.string().uuid(),
})
/**
 * @description OK
 */
export const postCreateDeployment200Schema = z.any()

export const postCreateDeploymentMutationResponseSchema = z.any()
