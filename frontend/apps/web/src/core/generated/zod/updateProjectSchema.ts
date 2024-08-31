import { z } from 'zod'
import { projectDtoSchema } from './projectDtoSchema'
import { updateProjectArgsSchema } from './updateProjectArgsSchema'

export const updateProjectPathParamsSchema = z.object({ id: z.string().uuid() })
/**
 * @description OK
 */
export const updateProject200Schema = z.lazy(() => projectDtoSchema)

export const updateProjectMutationRequestSchema = z.lazy(
	() => updateProjectArgsSchema,
)
/**
 * @description OK
 */
export const updateProjectMutationResponseSchema = z.lazy(
	() => projectDtoSchema,
)
