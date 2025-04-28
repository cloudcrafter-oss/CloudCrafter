export type DeleteTeamPathParams = {
  /**
   * @type string, uuid
   */
  teamId: string
}

/**
 * @description OK
 */
export type DeleteTeam200 = any

export type DeleteTeamMutationResponse = DeleteTeam200

export type DeleteTeamMutation = {
  Response: DeleteTeam200
  PathParams: DeleteTeamPathParams
  Errors: any
}