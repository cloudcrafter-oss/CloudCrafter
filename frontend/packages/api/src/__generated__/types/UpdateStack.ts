import type { ProblemDetails } from './ProblemDetails'
import type { StackDetailDto } from './StackDetailDto'
import type { UpdateStackCommand } from './UpdateStackCommand'

export type UpdateStackPathParams = {
  /**
   * @type string, uuid
   */
  id: string
}

/**
 * @description OK
 */
export type UpdateStack200 = StackDetailDto

/**
 * @description Not Found
 */
export type UpdateStack404 = ProblemDetails

export type UpdateStackMutationRequest = UpdateStackCommand

export type UpdateStackMutationResponse = UpdateStack200

export type UpdateStackMutation = {
  Response: UpdateStack200
  Request: UpdateStackMutationRequest
  PathParams: UpdateStackPathParams
  Errors: UpdateStack404
}