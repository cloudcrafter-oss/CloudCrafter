import { z } from 'zod'

const filterOperatorOptionSchema = z.enum([
	'equals',
	'contains',
	'startsWith',
	'endsWith',
])

export const filterCritereaSchema = z.object({
	propertyName: z.string(),
	operator: filterOperatorOptionSchema,
	value: z.string().nullable().optional(),
})

export const filterCritereaArraySchema = z.array(filterCritereaSchema)
