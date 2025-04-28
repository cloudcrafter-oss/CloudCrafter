import { z } from 'zod'

export const teamMemberDtoSchema = z.object({
  id: z.string().uuid(),
  email: z.string().nullable(),
  fullName: z.string().nullable(),
})