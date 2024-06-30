import { z } from 'zod'
import { paginatedListOfUserDtoSchema } from './paginatedListOfUserDtoSchema'


export const getUsersQueryParamsSchema = z.object({ 'Page': z.number().nullable().nullish(), 'PageSize': z.number().nullable().nullish() }).optional()

 export const getUsers200Schema = z.lazy(() => paginatedListOfUserDtoSchema)

 export const getUsersQueryResponseSchema = z.lazy(() => paginatedListOfUserDtoSchema)