import { z } from 'zod'

export const createServerCommandCommandSchema = z.object({
  name: z.string(),
})