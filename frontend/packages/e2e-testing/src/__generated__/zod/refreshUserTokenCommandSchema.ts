import { z } from 'zod'

export const refreshUserTokenCommandSchema = z.object({
  refreshToken: z.string(),
})