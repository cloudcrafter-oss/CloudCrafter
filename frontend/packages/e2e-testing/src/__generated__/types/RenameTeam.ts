import type { RenameTeamCommand } from './RenameTeamCommand'

export type RenameTeamPathParams = {
  /**
   * @type string, uuid
   */
  teamId: string
}

/**
 * @description OK
 */
export type RenameTeam200 = any

export type RenameTeamMutationRequest = RenameTeamCommand

export type RenameTeamMutationResponse = RenameTeam200

export type RenameTeamMutation = {
  Response: RenameTeam200
  Request: RenameTeamMutationRequest
  PathParams: RenameTeamPathParams
  Errors: any
}