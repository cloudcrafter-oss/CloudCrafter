import { z } from 'zod'
import { projectDtoSchema } from './projectDtoSchema'
import { updateProjectPatchArgsSchema } from './updateProjectPatchArgsSchema'


export const patchApiProjectsIdPathParamsSchema = z.object({ 'id': z.string().uuid() })
/**
 * @description OK
 */
export const patchApiProjectsId200Schema = z.lazy(() => projectDtoSchema)

 export const patchApiProjectsIdMutationRequestSchema = z.lazy(() => updateProjectPatchArgsSchema)
/**
 * @description OK
 */
export const patchApiProjectsIdMutationResponseSchema = z.lazy(() => projectDtoSchema)