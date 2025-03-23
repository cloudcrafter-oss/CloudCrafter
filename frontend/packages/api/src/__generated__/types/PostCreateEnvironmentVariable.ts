import type { CreateStackEnvironmentVariableCommand } from './CreateStackEnvironmentVariableCommand'

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

export type PostCreateEnvironmentVariableMutationRequest = CreateStackEnvironmentVariableCommand

export type PostCreateEnvironmentVariableMutationResponse = PostCreateEnvironmentVariable201

export type PostCreateEnvironmentVariableMutation = {
  Response: PostCreateEnvironmentVariable201
  Request: PostCreateEnvironmentVariableMutationRequest
  PathParams: PostCreateEnvironmentVariablePathParams
  Errors: any
}