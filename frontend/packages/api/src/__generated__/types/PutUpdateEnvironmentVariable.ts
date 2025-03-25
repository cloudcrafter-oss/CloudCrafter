import type { ProblemDetails } from './ProblemDetails'
import type { UpdateStackEnvironmentVariableCommand } from './UpdateStackEnvironmentVariableCommand'

export type PutUpdateEnvironmentVariablePathParams = {
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
export type PutUpdateEnvironmentVariable200 = any

/**
 * @description Bad Request
 */
export type PutUpdateEnvironmentVariable400 = ProblemDetails

export type PutUpdateEnvironmentVariableMutationRequest = UpdateStackEnvironmentVariableCommand

export type PutUpdateEnvironmentVariableMutationResponse = PutUpdateEnvironmentVariable200

export type PutUpdateEnvironmentVariableMutation = {
  Response: PutUpdateEnvironmentVariable200
  Request: PutUpdateEnvironmentVariableMutationRequest
  PathParams: PutUpdateEnvironmentVariablePathParams
  Errors: PutUpdateEnvironmentVariable400
}