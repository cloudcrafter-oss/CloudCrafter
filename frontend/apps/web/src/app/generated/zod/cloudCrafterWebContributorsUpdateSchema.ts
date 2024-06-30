import { z } from 'zod'
import { updateContributorResponseSchema } from './updateContributorResponseSchema'
import { errorResponseSchema } from './errorResponseSchema'
import { updateContributorRequestSchema } from './updateContributorRequestSchema'


export const cloudCrafterWebContributorsUpdatePathParamsSchema = z.object({ 'contributorId': z.number() })
/**
 * @description Success
 */
export const cloudCrafterWebContributorsUpdate200Schema = z.lazy(() => updateContributorResponseSchema)
/**
 * @description Bad Request
 */
export const cloudCrafterWebContributorsUpdate400Schema = z.lazy(() => errorResponseSchema)

 export const cloudCrafterWebContributorsUpdateMutationRequestSchema = z.lazy(() => updateContributorRequestSchema)
/**
 * @description Success
 */
export const cloudCrafterWebContributorsUpdateMutationResponseSchema = z.lazy(() => updateContributorResponseSchema)