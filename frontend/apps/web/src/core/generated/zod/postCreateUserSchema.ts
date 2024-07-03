import { z } from 'zod'
import { tokenDtoSchema } from './tokenDtoSchema'
import { postCreateUserQuerySchema } from './postCreateUserQuerySchema'

 /**
 * @description OK
 */
export const postCreateUser200Schema = z.lazy(() => tokenDtoSchema)

 export const postCreateUserMutationRequestSchema = z.lazy(() => postCreateUserQuerySchema)
/**
 * @description OK
 */
export const postCreateUserMutationResponseSchema = z.lazy(() => tokenDtoSchema)