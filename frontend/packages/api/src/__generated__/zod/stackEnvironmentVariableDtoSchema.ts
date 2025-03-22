import { environmentVariableTypeSchema } from './environmentVariableTypeSchema'
import { z } from 'zod'

export const stackEnvironmentVariableDtoSchema = z.object({
  id: z.string().uuid(),
  stackId: z.string().uuid(),
  key: z.string(),
  value: z.string(),
  isSecret: z.boolean(),
  type: z.lazy(() => environmentVariableTypeSchema),
  createdAt: z.string().datetime(),
  lastModifiedAt: z.string().datetime().nullable().nullish(),
  groupName: z.string().nullable().nullish(),
  isInherited: z.boolean(),
})