import { z } from 'zod'

export const updateStackEnvironmentVariableGroupCommandSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable().nullish(),
})