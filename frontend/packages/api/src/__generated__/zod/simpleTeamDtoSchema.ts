import { z } from 'zod'

export const simpleTeamDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})