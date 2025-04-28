import { z } from 'zod'

export const inviteUserBodySchema = z.object({
  email: z.string(),
})