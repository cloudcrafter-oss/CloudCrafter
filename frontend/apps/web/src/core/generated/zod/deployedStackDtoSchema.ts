import { z } from 'zod'
import { stackHealthStatusSchema } from './stackHealthStatusSchema'

export const deployedStackDtoSchema = z.object({
	stackId: z.string().uuid(),
	name: z.string(),
	healthStatus: z.lazy(() => stackHealthStatusSchema),
})
