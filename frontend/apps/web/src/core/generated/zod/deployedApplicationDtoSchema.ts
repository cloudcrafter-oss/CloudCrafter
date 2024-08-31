import { z } from 'zod'
import { applicationHealthStatusSchema } from './applicationHealthStatusSchema'

export const deployedApplicationDtoSchema = z.object({
	applicationId: z.string().uuid(),
	name: z.string(),
	healthStatus: z.lazy(() => applicationHealthStatusSchema),
})
