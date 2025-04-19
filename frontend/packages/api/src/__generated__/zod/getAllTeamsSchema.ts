import { simpleTeamDtoSchema } from './simpleTeamDtoSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const getAllTeams200Schema = z.array(z.lazy(() => simpleTeamDtoSchema))

export const getAllTeamsQueryResponseSchema = z.lazy(() => getAllTeams200Schema)