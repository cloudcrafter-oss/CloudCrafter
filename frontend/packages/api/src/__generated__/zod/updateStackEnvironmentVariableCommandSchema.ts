import { environmentVariableTypeSchema } from './environmentVariableTypeSchema'
import { z } from 'zod'

export const updateStackEnvironmentVariableCommandSchema = z.object({
  stackId: z.string().uuid(),
  id: z.string().uuid(),
  key: z.string(),
  value: z.string(),
  type: z.lazy(() => environmentVariableTypeSchema),
  isSecret: z.boolean(),
})