import { deploymentCreatedDetailsDtoSchema } from './deploymentCreatedDetailsDtoSchema'
import { z } from 'zod'

export const postDispatchStackDeploymentPathParamsSchema = z.object({
  id: z.string().uuid(),
})

/**
 * @description OK
 */
export const postDispatchStackDeployment200Schema = z.lazy(() => deploymentCreatedDetailsDtoSchema)

export const postDispatchStackDeploymentMutationResponseSchema = z.lazy(() => postDispatchStackDeployment200Schema)