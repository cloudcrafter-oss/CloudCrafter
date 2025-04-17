import type { ProblemDetails } from './ProblemDetails'
import type { UpdateStackServiceVolumeCommand } from './UpdateStackServiceVolumeCommand'

export type PutUpdateStackServiceVolumePathParams = {
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
export type PutUpdateStackServiceVolume200 = any

/**
 * @description Bad Request
 */
export type PutUpdateStackServiceVolume400 = ProblemDetails

export type PutUpdateStackServiceVolumeMutationRequest = UpdateStackServiceVolumeCommand

export type PutUpdateStackServiceVolumeMutationResponse = PutUpdateStackServiceVolume200

export type PutUpdateStackServiceVolumeMutation = {
  Response: PutUpdateStackServiceVolume200
  Request: PutUpdateStackServiceVolumeMutationRequest
  PathParams: PutUpdateStackServiceVolumePathParams
  Errors: PutUpdateStackServiceVolume400
}