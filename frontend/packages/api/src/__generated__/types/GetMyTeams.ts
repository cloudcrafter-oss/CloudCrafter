import type { SimpleTeamDto } from './SimpleTeamDto'

/**
 * @description OK
 */
export type GetMyTeams200 = SimpleTeamDto[]

export type GetMyTeamsQueryResponse = GetMyTeams200

export type GetMyTeamsQuery = {
  Response: GetMyTeams200
  Errors: any
}