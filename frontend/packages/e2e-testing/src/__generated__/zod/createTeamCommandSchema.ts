import { z } from 'zod'

export const createTeamCommandSchema = z.object({
  name: z.string(),
})