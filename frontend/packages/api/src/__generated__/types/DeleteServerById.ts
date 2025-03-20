export type DeleteServerByIdPathParams = {
  /**
   * @type string, uuid
   */
  id: string
}

/**
 * @description OK
 */
export type DeleteServerById200 = any

export type DeleteServerByIdMutationResponse = DeleteServerById200

export type DeleteServerByIdMutation = {
  Response: DeleteServerById200
  PathParams: DeleteServerByIdPathParams
  Errors: any
}