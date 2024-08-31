import { z } from 'zod'
import { userDtoSchema } from './userDtoSchema'

export const userDtoPaginatedListSchema = z.object({
	page: z.number(),
	totalPages: z.number(),
	totalItems: z.number(),
	result: z.array(z.lazy(() => userDtoSchema)),
})
