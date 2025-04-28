import type { SimpleTeamDto } from './SimpleTeamDto'

/**
 * @description OK
 */
export type GetAllTeams200 = SimpleTeamDto[]

export type GetAllTeamsQueryResponse = GetAllTeams200

export type GetAllTeamsQuery = {
  Response: GetAllTeams200
  Errors: any
}