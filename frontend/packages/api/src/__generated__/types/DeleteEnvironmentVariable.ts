import type { ProblemDetails } from './ProblemDetails'

export type DeleteEnvironmentVariablePathParams = {
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
export type DeleteEnvironmentVariable200 = any

/**
 * @description Bad Request
 */
export type DeleteEnvironmentVariable400 = ProblemDetails

export type DeleteEnvironmentVariableMutationResponse = DeleteEnvironmentVariable200

export type DeleteEnvironmentVariableMutation = {
  Response: DeleteEnvironmentVariable200
  PathParams: DeleteEnvironmentVariablePathParams
  Errors: DeleteEnvironmentVariable400
}