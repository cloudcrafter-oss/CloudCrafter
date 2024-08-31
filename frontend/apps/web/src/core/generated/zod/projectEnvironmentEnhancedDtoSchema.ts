import { z } from 'zod'
import { deployedStackDtoSchema } from './deployedStackDtoSchema'

export const projectEnvironmentEnhancedDtoSchema = z.object({
	environmentCreatedAt: z.string().datetime(),
	deployedStackCount: z.number(),
	lastDeploymentAt: z.string().datetime().nullable().nullish(),
	environmentName: z.string(),
	projectName: z.string(),
	deployedStacks: z.array(z.lazy(() => deployedStackDtoSchema)),
})
