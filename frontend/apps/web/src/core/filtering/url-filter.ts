import { filterCritereaArraySchema } from '@/src/core/filtering/schema.ts'

import type { z } from 'zod'

export function parseFilterQuery(
	queryString: string,
): z.infer<typeof filterCritereaArraySchema>[] {
	const params = new URLSearchParams(queryString)
	const filters = params.getAll('filter[]')

	const parsedFilters = filters.map((filter) => {
		const [propertyName, operator, value] = filter.split('~')

		let zodOperator: z.infer<typeof filterOperatorOptionSchema>
		switch (operator) {
			case 'eq':
				zodOperator = 'Equal'
				break
			case 'ne':
				zodOperator = 'NotEqual'
				break
			// Add more cases for other operators as needed
			default:
				throw new Error(`Unsupported operator: ${operator}`)
		}

		return filterCritereaArraySchema.parse({
			propertyName,
			operator: zodOperator,
			value: value || null,
		})
	})

	return parsedFilters
}
