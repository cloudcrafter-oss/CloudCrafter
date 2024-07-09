import { z } from 'zod'
import { serverDetailDtoSchema } from './serverDetailDtoSchema'


export const getServerByIdPathParamsSchema = z.object({ 'id': z.string().uuid() })
/**
 * @description OK
 */
export const getServerById200Schema = z.lazy(() => serverDetailDtoSchema)
/**
 * @description OK
 */
export const getServerByIdQueryResponseSchema = z.lazy(() => serverDetailDtoSchema)