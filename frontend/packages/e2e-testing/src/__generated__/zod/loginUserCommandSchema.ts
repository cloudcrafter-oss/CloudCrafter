import { z } from 'zod'

export const loginUserCommandSchema = z.object({
  email: z.string(),
  password: z.string(),
})