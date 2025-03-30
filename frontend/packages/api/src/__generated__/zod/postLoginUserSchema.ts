import { loginUserCommandSchema } from './loginUserCommandSchema'
import { tokenDtoSchema } from './tokenDtoSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const postLoginUser200Schema = z.lazy(() => tokenDtoSchema)

export const postLoginUserMutationRequestSchema = z.lazy(() => loginUserCommandSchema)

export const postLoginUserMutationResponseSchema = z.lazy(() => postLoginUser200Schema)