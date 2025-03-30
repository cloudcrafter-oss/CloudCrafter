import { z } from 'zod'

export const createServerCommandSchema = z.object({
  name: z.string(),
})