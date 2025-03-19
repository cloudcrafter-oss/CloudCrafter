import { z } from 'zod'

export const postCreateUserQuerySchema = z.object({
  email: z.string(),
  name: z.string(),
})