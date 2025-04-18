import { simpleTeamDtoSchema } from './simpleTeamDtoSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const getMyTeams200Schema = z.array(z.lazy(() => simpleTeamDtoSchema))

export const getMyTeamsQueryResponseSchema = z.lazy(() => getMyTeams200Schema)