import { createUserCommandSchema } from './createUserCommandSchema'
import { tokenDtoSchema } from './tokenDtoSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const postCreateUser200Schema = z.lazy(() => tokenDtoSchema)

export const postCreateUserMutationRequestSchema = z.lazy(() => createUserCommandSchema)

export const postCreateUserMutationResponseSchema = z.lazy(() => postCreateUser200Schema)