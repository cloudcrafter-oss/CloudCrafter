import { z } from 'zod'
import { errorResponseSchema } from './errorResponseSchema'


export const cloudCrafterWebContributorsDeletePathParamsSchema = z.object({ 'contributorId': z.number() })
/**
 * @description Success
 */
export const cloudCrafterWebContributorsDelete200Schema = z.any()
/**
 * @description Bad Request
 */
export const cloudCrafterWebContributorsDelete400Schema = z.lazy(() => errorResponseSchema)
/**
 * @description Success
 */
export const cloudCrafterWebContributorsDeleteMutationResponseSchema = z.any()