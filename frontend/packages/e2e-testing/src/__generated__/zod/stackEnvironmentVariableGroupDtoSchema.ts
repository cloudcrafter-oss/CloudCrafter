import { z } from 'zod'

export const stackEnvironmentVariableGroupDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().nullish(),
})