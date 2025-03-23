import { z } from 'zod'

export const createProjectCommandSchema = z.object({
  name: z.string(),
})