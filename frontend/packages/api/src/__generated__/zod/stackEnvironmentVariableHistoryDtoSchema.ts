import { environmentVariableTypeSchema } from './environmentVariableTypeSchema'
import { z } from 'zod'

export const stackEnvironmentVariableHistoryDtoSchema = z.object({
  id: z.string().uuid(),
  stackId: z.string().uuid(),
  environmentVariableId: z.string().uuid(),
  key: z.string(),
  oldValue: z.string().nullable().nullish(),
  newValue: z.string().nullable().nullish(),
  isSecret: z.boolean(),
  type: z.lazy(() => environmentVariableTypeSchema),
  changeType: z.string(),
  groupName: z.string().nullable().nullish(),
  timestamp: z.string().datetime(),
  userId: z.string().nullable().nullish(),
  userName: z.string().nullable().nullish(),
})