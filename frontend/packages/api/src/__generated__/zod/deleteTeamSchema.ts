import { z } from 'zod'

export const deleteTeamPathParamsSchema = z.object({
  teamId: z.string().uuid(),
})

/**
 * @description OK
 */
export const deleteTeam200Schema = z.any()

export const deleteTeamMutationResponseSchema = z.lazy(() => deleteTeam200Schema)