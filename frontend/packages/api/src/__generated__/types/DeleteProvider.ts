export type DeleteProviderPathParams = {
  /**
   * @type string, uuid
   */
  id: string
}

/**
 * @description OK
 */
export type DeleteProvider200 = any

export type DeleteProviderMutationResponse = DeleteProvider200

export type DeleteProviderMutation = {
  Response: DeleteProvider200
  PathParams: DeleteProviderPathParams
  Errors: any
}