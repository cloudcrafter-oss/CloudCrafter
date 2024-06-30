import { z } from 'zod'
import { contributorRecordSchema } from './contributorRecordSchema'
import { errorResponseSchema } from './errorResponseSchema'


export const cloudCrafterWebContributorsGetByIdPathParamsSchema = z.object({ 'contributorId': z.number() })
/**
 * @description Success
 */
export const cloudCrafterWebContributorsGetById200Schema = z.lazy(() => contributorRecordSchema)
/**
 * @description Bad Request
 */
export const cloudCrafterWebContributorsGetById400Schema = z.lazy(() => errorResponseSchema)
/**
 * @description Success
 */
export const cloudCrafterWebContributorsGetByIdQueryResponseSchema = z.lazy(() => contributorRecordSchema)