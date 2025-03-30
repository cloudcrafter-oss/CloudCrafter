import { paginatedListOfSimpleDeploymentDtoSchema } from './paginatedListOfSimpleDeploymentDtoSchema'
import { z } from 'zod'

export const getDeploymentsForServerPathParamsSchema = z.object({
  id: z.string().uuid(),
})

export const getDeploymentsForServerQueryParamsSchema = z
  .object({
    Page: z.number().int().optional(),
    PageSize: z.number().int().optional(),
  })
  .optional()

/**
 * @description OK
 */
export const getDeploymentsForServer200Schema = z.lazy(() => paginatedListOfSimpleDeploymentDtoSchema)

export const getDeploymentsForServerQueryResponseSchema = z.lazy(() => getDeploymentsForServer200Schema)