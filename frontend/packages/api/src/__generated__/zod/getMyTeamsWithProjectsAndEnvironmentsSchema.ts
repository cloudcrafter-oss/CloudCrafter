import { simpleTeamWithProjectsAndEnvironmentsDtoSchema } from './simpleTeamWithProjectsAndEnvironmentsDtoSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const getMyTeamsWithProjectsAndEnvironments200Schema = z.array(z.lazy(() => simpleTeamWithProjectsAndEnvironmentsDtoSchema))

export const getMyTeamsWithProjectsAndEnvironmentsQueryResponseSchema = z.lazy(() => getMyTeamsWithProjectsAndEnvironments200Schema)