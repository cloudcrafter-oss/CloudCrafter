import { environmentVariableTypeSchema } from './environmentVariableTypeSchema'
import { z } from 'zod'

export const updateStackEnvironmentVariableCommandSchema = z.object({
  key: z.string(),
  value: z.string(),
  type: z.lazy(() => environmentVariableTypeSchema),
  isSecret: z.boolean(),
  groupId: z.string().uuid().nullable().nullish(),
})