import { z } from 'zod'
import { tokenDtoSchema } from './tokenDtoSchema'
import { querySchema } from './querySchema'


export const postLoginUser200Schema = z.lazy(() => tokenDtoSchema)

 export const postLoginUserMutationRequestSchema = z.lazy(() => querySchema)

 export const postLoginUserMutationResponseSchema = z.lazy(() => tokenDtoSchema)