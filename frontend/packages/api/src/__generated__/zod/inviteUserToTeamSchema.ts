import { z } from 'zod'

export const inviteUserToTeamPathParamsSchema = z.object({
  teamId: z.string().uuid(),
})

/**
 * @description OK
 */
export const inviteUserToTeam200Schema = z.any()

export const inviteUserToTeamMutationRequestSchema = z.string()

export const inviteUserToTeamMutationResponseSchema = z.lazy(() => inviteUserToTeam200Schema)