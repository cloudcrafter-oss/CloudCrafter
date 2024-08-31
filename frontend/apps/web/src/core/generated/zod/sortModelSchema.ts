import { z } from 'zod'
import { sortDirectionSchema } from './sortDirectionSchema'

export const sortModelSchema = z.object({
	field: z.string(),
	direction: z.lazy(() => sortDirectionSchema),
})
