import { teamMemberDtoSchema } from './teamMemberDtoSchema'
import { z } from 'zod'

export const paginatedListOfTeamMemberDtoSchema = z.object({
  page: z.number().int(),
  totalPages: z.number().int(),
  totalItems: z.number().int(),
  result: z.array(z.lazy(() => teamMemberDtoSchema)),
})