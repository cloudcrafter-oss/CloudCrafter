import { removeMemberBodySchema } from './removeMemberBodySchema'
import { z } from 'zod'

export const removeUserFromTeamPathParamsSchema = z.object({
  teamId: z.string().uuid(),
})

/**
 * @description OK
 */
export const removeUserFromTeam200Schema = z.any()

export const removeUserFromTeamMutationRequestSchema = z.lazy(() => removeMemberBodySchema)

export const removeUserFromTeamMutationResponseSchema = z.lazy(() => removeUserFromTeam200Schema)