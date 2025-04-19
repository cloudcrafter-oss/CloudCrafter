import { renameTeamCommandSchema } from './renameTeamCommandSchema'
import { z } from 'zod'

export const renameTeamPathParamsSchema = z.object({
  teamId: z.string().uuid(),
})

/**
 * @description OK
 */
export const renameTeam200Schema = z.any()

export const renameTeamMutationRequestSchema = z.lazy(() => renameTeamCommandSchema)

export const renameTeamMutationResponseSchema = z.lazy(() => renameTeam200Schema)