import { z } from 'zod'
import { postRefreshUserTokensQuerySchema } from './postRefreshUserTokensQuerySchema'
import { tokenDtoSchema } from './tokenDtoSchema'

/**
 * @description OK
 */
export const postRefreshTokens200Schema = z.lazy(() => tokenDtoSchema)

export const postRefreshTokensMutationRequestSchema = z.lazy(
	() => postRefreshUserTokensQuerySchema,
)
/**
 * @description OK
 */
export const postRefreshTokensMutationResponseSchema = z.lazy(
	() => tokenDtoSchema,
)
