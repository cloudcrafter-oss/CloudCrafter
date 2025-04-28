export type InviteUserToTeamPathParams = {
  /**
   * @type string, uuid
   */
  teamId: string
}

/**
 * @description OK
 */
export type InviteUserToTeam200 = any

export type InviteUserToTeamMutationRequest = string

export type InviteUserToTeamMutationResponse = InviteUserToTeam200

export type InviteUserToTeamMutation = {
  Response: InviteUserToTeam200
  Request: InviteUserToTeamMutationRequest
  PathParams: InviteUserToTeamPathParams
  Errors: any
}