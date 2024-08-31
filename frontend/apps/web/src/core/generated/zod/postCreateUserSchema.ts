import { z } from 'zod'
import { postCreateUserQuerySchema } from './postCreateUserQuerySchema'
import { tokenDtoSchema } from './tokenDtoSchema'

/**
 * @description OK
 */
export const postCreateUser200Schema = z.lazy(() => tokenDtoSchema)

export const postCreateUserMutationRequestSchema = z.lazy(
	() => postCreateUserQuerySchema,
)
/**
 * @description OK
 */
export const postCreateUserMutationResponseSchema = z.lazy(() => tokenDtoSchema)
