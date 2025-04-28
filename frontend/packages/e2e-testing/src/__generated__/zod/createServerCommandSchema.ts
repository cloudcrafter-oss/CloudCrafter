import { z } from 'zod'

export const createServerCommandSchema = z.object({
  name: z.string(),
  teamId: z.string().uuid().nullable().nullish(),
})