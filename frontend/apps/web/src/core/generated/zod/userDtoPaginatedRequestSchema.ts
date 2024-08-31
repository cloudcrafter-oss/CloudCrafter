import { z } from 'zod'
import { filterCritereaSchema } from './filterCritereaSchema'
import { sortModelSchema } from './sortModelSchema'

export const userDtoPaginatedRequestSchema = z.object({
	page: z.number(),
	pageSize: z.number(),
	filters: z.array(z.lazy(() => filterCritereaSchema)),
	sortBy: z
		.array(z.lazy(() => sortModelSchema))
		.nullable()
		.nullish(),
})
