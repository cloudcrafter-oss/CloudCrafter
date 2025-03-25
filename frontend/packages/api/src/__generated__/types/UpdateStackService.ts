import type { UpdateStackServiceCommand } from './UpdateStackServiceCommand'

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

export type UpdateStackServiceMutationRequest = UpdateStackServiceCommand

export type UpdateStackServiceMutationResponse = UpdateStackService200

export type UpdateStackServiceMutation = {
  Response: UpdateStackService200
  Request: UpdateStackServiceMutationRequest
  PathParams: UpdateStackServicePathParams
  Errors: any
}