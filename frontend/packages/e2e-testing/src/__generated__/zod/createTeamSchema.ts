import { createTeamCommandSchema } from './createTeamCommandSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const createTeam200Schema = z.string().uuid()

export const createTeamMutationRequestSchema = z.lazy(() => createTeamCommandSchema)

export const createTeamMutationResponseSchema = z.lazy(() => createTeam200Schema)