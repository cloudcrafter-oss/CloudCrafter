import { z } from 'zod'
import { tokenDtoSchema } from './tokenDtoSchema'
import { postRefreshUserTokensQuerySchema } from './postRefreshUserTokensQuerySchema'

 /**
 * @description OK
 */
export const postRefreshTokens200Schema = z.lazy(() => tokenDtoSchema)

 export const postRefreshTokensMutationRequestSchema = z.lazy(() => postRefreshUserTokensQuerySchema)
/**
 * @description OK
 */
export const postRefreshTokensMutationResponseSchema = z.lazy(() => tokenDtoSchema)