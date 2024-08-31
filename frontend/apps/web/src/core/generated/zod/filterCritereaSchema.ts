import { z } from 'zod'
import { filterOperatorOptionSchema } from './filterOperatorOptionSchema'

export const filterCritereaSchema = z.object({
	propertyName: z.string(),
	operator: z.lazy(() => filterOperatorOptionSchema),
	value: z.string().nullable().nullish(),
})
