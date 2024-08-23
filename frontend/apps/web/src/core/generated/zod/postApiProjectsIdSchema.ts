import { z } from 'zod'
import { projectDtoSchema } from './projectDtoSchema'
import { updateProjectArgsSchema } from './updateProjectArgsSchema'


export const postApiProjectsIdPathParamsSchema = z.object({ 'id': z.string().uuid() })
/**
 * @description OK
 */
export const postApiProjectsId200Schema = z.lazy(() => projectDtoSchema)

 export const postApiProjectsIdMutationRequestSchema = z.lazy(() => updateProjectArgsSchema)
/**
 * @description OK
 */
export const postApiProjectsIdMutationResponseSchema = z.lazy(() => projectDtoSchema)