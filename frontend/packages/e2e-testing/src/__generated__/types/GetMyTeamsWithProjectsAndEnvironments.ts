import type { SimpleTeamWithProjectsAndEnvironmentsDto } from './SimpleTeamWithProjectsAndEnvironmentsDto'

/**
 * @description OK
 */
export type GetMyTeamsWithProjectsAndEnvironments200 = SimpleTeamWithProjectsAndEnvironmentsDto[]

export type GetMyTeamsWithProjectsAndEnvironmentsQueryResponse = GetMyTeamsWithProjectsAndEnvironments200

export type GetMyTeamsWithProjectsAndEnvironmentsQuery = {
  Response: GetMyTeamsWithProjectsAndEnvironments200
  Errors: any
}