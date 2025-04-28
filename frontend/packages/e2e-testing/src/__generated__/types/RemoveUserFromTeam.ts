import type { RemoveMemberBody } from './RemoveMemberBody'

export type RemoveUserFromTeamPathParams = {
  /**
   * @type string, uuid
   */
  teamId: string
}

/**
 * @description OK
 */
export type RemoveUserFromTeam200 = any

export type RemoveUserFromTeamMutationRequest = RemoveMemberBody

export type RemoveUserFromTeamMutationResponse = RemoveUserFromTeam200

export type RemoveUserFromTeamMutation = {
  Response: RemoveUserFromTeam200
  Request: RemoveUserFromTeamMutationRequest
  PathParams: RemoveUserFromTeamPathParams
  Errors: any
}