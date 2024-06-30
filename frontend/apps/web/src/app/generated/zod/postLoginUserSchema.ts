import { z } from 'zod'
import { tokenDtoSchema } from './tokenDtoSchema'
import { postLoginUserQuerySchema } from './postLoginUserQuerySchema'


export const postLoginUser200Schema = z.lazy(() => tokenDtoSchema)

 export const postLoginUserMutationRequestSchema = z.lazy(() => postLoginUserQuerySchema)

 export const postLoginUserMutationResponseSchema = z.lazy(() => tokenDtoSchema)