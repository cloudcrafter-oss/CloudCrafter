import { z } from 'zod'

export const removeMemberBodySchema = z.object({
  email: z.string(),
})