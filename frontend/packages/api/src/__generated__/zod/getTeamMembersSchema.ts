import { filterCritereaSchema } from './filterCritereaSchema'
import { paginatedListOfTeamMemberDtoSchema } from './paginatedListOfTeamMemberDtoSchema'
import { z } from 'zod'

export const getTeamMembersPathParamsSchema = z.object({
  teamId: z.string().uuid(),
})

export const getTeamMembersQueryParamsSchema = z
  .object({
    Filters: z.array(z.lazy(() => filterCritereaSchema)).optional(),
    Page: z.number().int().optional(),
    PageSize: z.number().int().optional(),
  })
  .optional()

/**
 * @description OK
 */
export const getTeamMembers200Schema = z.lazy(() => paginatedListOfTeamMemberDtoSchema)

export const getTeamMembersQueryResponseSchema = z.lazy(() => getTeamMembers200Schema)