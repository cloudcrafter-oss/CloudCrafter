import type { ProblemDetails } from './ProblemDetails'

export type PostImportEnvironmentVariablesPathParams = {
  /**
   * @type string, uuid
   */
  stackId: string
}

/**
 * @description OK
 */
export type PostImportEnvironmentVariables200 = any

/**
 * @description Bad Request
 */
export type PostImportEnvironmentVariables400 = ProblemDetails

export type PostImportEnvironmentVariablesMutationResponse = PostImportEnvironmentVariables200

export type PostImportEnvironmentVariablesMutation = {
  Response: PostImportEnvironmentVariables200
  PathParams: PostImportEnvironmentVariablesPathParams
  Errors: PostImportEnvironmentVariables400
}