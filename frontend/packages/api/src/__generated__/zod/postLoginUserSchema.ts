import { postLoginUserQuerySchema } from './postLoginUserQuerySchema'
import { tokenDtoSchema } from './tokenDtoSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const postLoginUser200Schema = z.lazy(() => tokenDtoSchema)

export const postLoginUserMutationRequestSchema = z.lazy(() => postLoginUserQuerySchema)

export const postLoginUserMutationResponseSchema = z.lazy(() => postLoginUser200Schema)