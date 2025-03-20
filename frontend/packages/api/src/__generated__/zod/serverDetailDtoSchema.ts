import { z } from 'zod'

export const serverDetailDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  ipAddress: z.string(),
  agentKey: z.string().nullable().nullish(),
})