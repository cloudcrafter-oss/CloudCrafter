import { z } from 'zod'

export const createUserCommandSchema = z.object({
  email: z.string(),
  name: z.string(),
})