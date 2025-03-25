import type { ProblemDetails } from './ProblemDetails'
import type { UpdateStackEnvironmentVariableGroupCommand } from './UpdateStackEnvironmentVariableGroupCommand'

export type PutUpdateEnvironmentVariableGroupPathParams = {
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
export type PutUpdateEnvironmentVariableGroup200 = any

/**
 * @description Bad Request
 */
export type PutUpdateEnvironmentVariableGroup400 = ProblemDetails

export type PutUpdateEnvironmentVariableGroupMutationRequest = UpdateStackEnvironmentVariableGroupCommand

export type PutUpdateEnvironmentVariableGroupMutationResponse = PutUpdateEnvironmentVariableGroup200

export type PutUpdateEnvironmentVariableGroupMutation = {
  Response: PutUpdateEnvironmentVariableGroup200
  Request: PutUpdateEnvironmentVariableGroupMutationRequest
  PathParams: PutUpdateEnvironmentVariableGroupPathParams
  Errors: PutUpdateEnvironmentVariableGroup400
}