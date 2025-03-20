import { postRefreshUserTokensQuerySchema } from './postRefreshUserTokensQuerySchema'
import { tokenDtoSchema } from './tokenDtoSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const postRefreshTokens200Schema = z.lazy(() => tokenDtoSchema)

export const postRefreshTokensMutationRequestSchema = z.lazy(() => postRefreshUserTokensQuerySchema)

export const postRefreshTokensMutationResponseSchema = z.lazy(() => postRefreshTokens200Schema)