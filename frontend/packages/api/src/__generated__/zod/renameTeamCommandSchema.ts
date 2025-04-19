import { z } from 'zod'

export const renameTeamCommandSchema = z.object({
  name: z.string(),
})