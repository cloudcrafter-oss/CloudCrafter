import { paginatedListOfUserDtoSchema } from './paginatedListOfUserDtoSchema'
import { z } from 'zod'

export const getUsersQueryParamsSchema = z
  .object({
    Page: z.number().int().optional(),
    PageSize: z.number().int().optional(),
  })
  .optional()

/**
 * @description OK
 */
export const getUsers200Schema = z.lazy(() => paginatedListOfUserDtoSchema)

export const getUsersQueryResponseSchema = z.lazy(() => getUsers200Schema)