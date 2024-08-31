import { z } from 'zod'
import { postLoginUserQuerySchema } from './postLoginUserQuerySchema'
import { tokenDtoSchema } from './tokenDtoSchema'

/**
 * @description OK
 */
export const postLoginUser200Schema = z.lazy(() => tokenDtoSchema)

export const postLoginUserMutationRequestSchema = z.lazy(
	() => postLoginUserQuerySchema,
)
/**
 * @description OK
 */
export const postLoginUserMutationResponseSchema = z.lazy(() => tokenDtoSchema)
