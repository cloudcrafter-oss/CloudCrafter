import { filterCritereaSchema } from './filterCritereaSchema'
import { paginatedListOfUserDtoSchema } from './paginatedListOfUserDtoSchema'
import { z } from 'zod'

export const getUsersQueryParamsSchema = z
  .object({
    Filters: z.array(z.lazy(() => filterCritereaSchema)).optional(),
    Page: z.number().int().optional(),
    PageSize: z.number().int().optional(),
  })
  .optional()

/**
 * @description OK
 */
export const getUsers200Schema = z.lazy(() => paginatedListOfUserDtoSchema)

export const getUsersQueryResponseSchema = z.lazy(() => getUsers200Schema)