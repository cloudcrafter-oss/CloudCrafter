import type { UpdateStackServiceCommandCommand } from './UpdateStackServiceCommandCommand'

export type UpdateStackServicePathParams = {
  /**
   * @type string, uuid
   */
  stackId: string
  /**
   * @type string, uuid
   */
  stackServiceId: string
}

/**
 * @description OK
 */
export type UpdateStackService200 = any

export type UpdateStackServiceMutationRequest = UpdateStackServiceCommandCommand

export type UpdateStackServiceMutationResponse = UpdateStackService200

export type UpdateStackServiceMutation = {
  Response: UpdateStackService200
  Request: UpdateStackServiceMutationRequest
  PathParams: UpdateStackServicePathParams
  Errors: any
}