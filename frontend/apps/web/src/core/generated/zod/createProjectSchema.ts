import { z } from 'zod'
import { createProjectCommandCommandSchema } from './createProjectCommandCommandSchema'
import { projectDtoSchema } from './projectDtoSchema'

/**
 * @description OK
 */
export const createProject200Schema = z.lazy(() => projectDtoSchema)

export const createProjectMutationRequestSchema = z.lazy(
	() => createProjectCommandCommandSchema,
)
/**
 * @description OK
 */
export const createProjectMutationResponseSchema = z.lazy(
	() => projectDtoSchema,
)
