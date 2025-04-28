import { z } from 'zod'

export const roleDtoSchema = z.object({
  name: z.string(),
})