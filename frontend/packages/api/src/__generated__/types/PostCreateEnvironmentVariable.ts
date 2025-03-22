import type { CreateStackEnvironmentVariableCommand } from './CreateStackEnvironmentVariableCommand'
import type { ProblemDetails } from './ProblemDetails'

export type PostCreateEnvironmentVariablePathParams = {
  /**
   * @type string, uuid
   */
  stackId: string
}

/**
 * @description Created
 */
export type PostCreateEnvironmentVariable201 = any

/**
 * @description Bad Request
 */
export type PostCreateEnvironmentVariable400 = ProblemDetails

export type PostCreateEnvironmentVariableMutationRequest = CreateStackEnvironmentVariableCommand

export type PostCreateEnvironmentVariableMutationResponse = PostCreateEnvironmentVariable201

export type PostCreateEnvironmentVariableMutation = {
  Response: PostCreateEnvironmentVariable201
  Request: PostCreateEnvironmentVariableMutationRequest
  PathParams: PostCreateEnvironmentVariablePathParams
  Errors: PostCreateEnvironmentVariable400
}