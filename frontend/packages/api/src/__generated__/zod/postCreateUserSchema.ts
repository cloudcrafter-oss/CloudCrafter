import { postCreateUserQuerySchema } from './postCreateUserQuerySchema'
import { tokenDtoSchema } from './tokenDtoSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const postCreateUser200Schema = z.lazy(() => tokenDtoSchema)

export const postCreateUserMutationRequestSchema = z.lazy(() => postCreateUserQuerySchema)

export const postCreateUserMutationResponseSchema = z.lazy(() => postCreateUser200Schema)