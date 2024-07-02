import { z } from 'zod'
import { userDtoPaginatedListSchema } from './userDtoPaginatedListSchema'


export const getUsersQueryParamsSchema = z.object({ 'Page': z.number().optional(), 'PageSize': z.number().optional() }).optional()
/**
 * @description OK
 */
export const getUsers200Schema = z.lazy(() => userDtoPaginatedListSchema)
/**
 * @description OK
 */
export const getUsersQueryResponseSchema = z.lazy(() => userDtoPaginatedListSchema)