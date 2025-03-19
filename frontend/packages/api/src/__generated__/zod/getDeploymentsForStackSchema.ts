import { simpleDeploymentDtoSchema } from './simpleDeploymentDtoSchema'
import { z } from 'zod'

export const getDeploymentsForStackPathParamsSchema = z.object({
  id: z.string().uuid(),
})

/**
 * @description OK
 */
export const getDeploymentsForStack200Schema = z.array(z.lazy(() => simpleDeploymentDtoSchema))

export const getDeploymentsForStackQueryResponseSchema = z.lazy(() => getDeploymentsForStack200Schema)