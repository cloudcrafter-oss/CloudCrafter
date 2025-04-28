export type DeleteStackServiceVolumePathParams = {
  /**
   * @type string, uuid
   */
  stackId: string
  /**
   * @type string, uuid
   */
  stackServiceId: string
  /**
   * @type string, uuid
   */
  id: string
}

/**
 * @description OK
 */
export type DeleteStackServiceVolume200 = any

export type DeleteStackServiceVolumeMutationResponse = DeleteStackServiceVolume200

export type DeleteStackServiceVolumeMutation = {
  Response: DeleteStackServiceVolume200
  PathParams: DeleteStackServiceVolumePathParams
  Errors: any
}