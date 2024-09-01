import { filterOperatorOption } from '@/src/core/__generated__'
import { z } from 'zod'

const filterOperatorOptionSchema = z.enum(
	Object.keys(filterOperatorOption) as [
		keyof typeof filterOperatorOption,
		...Array<keyof typeof filterOperatorOption>,
	],
)

export const filterCritereaSchema = z.object({
	propertyName: z.string(),
	operator: filterOperatorOptionSchema,
	value: z.string().nullable().optional(),
})

export const filterCritereaArraySchema = z.array(filterCritereaSchema)
