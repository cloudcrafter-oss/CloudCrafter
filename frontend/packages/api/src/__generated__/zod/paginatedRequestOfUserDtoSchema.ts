import { filterCritereaSchema } from './filterCritereaSchema'
import { z } from 'zod'

export const paginatedRequestOfUserDtoSchema = z.object({
  filters: z.array(z.lazy(() => filterCritereaSchema)),
  page: z.number().int(),
  pageSize: z.number().int(),
})