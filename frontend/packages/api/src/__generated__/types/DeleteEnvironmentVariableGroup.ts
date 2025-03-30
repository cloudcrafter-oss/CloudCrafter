export type DeleteEnvironmentVariableGroupPathParams = {
  /**
   * @type string, uuid
   */
  stackId: string
  /**
   * @type string, uuid
   */
  id: string
}

/**
 * @description OK
 */
export type DeleteEnvironmentVariableGroup200 = any

export type DeleteEnvironmentVariableGroupMutationResponse = DeleteEnvironmentVariableGroup200

export type DeleteEnvironmentVariableGroupMutation = {
  Response: DeleteEnvironmentVariableGroup200
  PathParams: DeleteEnvironmentVariableGroupPathParams
  Errors: any
}