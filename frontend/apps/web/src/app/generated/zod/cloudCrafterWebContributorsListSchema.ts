import { z } from 'zod'
import { contributorListResponseSchema } from './contributorListResponseSchema'

 /**
 * @description Success
 */
export const cloudCrafterWebContributorsList200Schema = z.lazy(() => contributorListResponseSchema)
/**
 * @description Success
 */
export const cloudCrafterWebContributorsListQueryResponseSchema = z.lazy(() => contributorListResponseSchema)