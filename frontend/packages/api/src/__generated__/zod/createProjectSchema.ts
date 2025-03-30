import { createProjectCommandSchema } from './createProjectCommandSchema'
import { projectDtoSchema } from './projectDtoSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const createProject200Schema = z.lazy(() => projectDtoSchema)

export const createProjectMutationRequestSchema = z.lazy(() => createProjectCommandSchema)

export const createProjectMutationResponseSchema = z.lazy(() => createProject200Schema)