import { z } from 'zod'

export const createStackEnvironmentVariableCommandSchema = z.object({
  stackId: z.string().uuid(),
  key: z.string(),
  value: z.string(),
})