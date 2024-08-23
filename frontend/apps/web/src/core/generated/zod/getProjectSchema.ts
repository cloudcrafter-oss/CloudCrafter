import { z } from 'zod'
import { projectDtoSchema } from './projectDtoSchema'


export const getProjectPathParamsSchema = z.object({ 'id': z.string().uuid() })
/**
 * @description OK
 */
export const getProject200Schema = z.lazy(() => projectDtoSchema)
/**
 * @description Not Found
 */
export const getProject404Schema = z.any()
/**
 * @description OK
 */
export const getProjectQueryResponseSchema = z.lazy(() => projectDtoSchema)