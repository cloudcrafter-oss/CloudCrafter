import type { CreateStackEnvironmentVariableGroupCommand } from './CreateStackEnvironmentVariableGroupCommand'

export type PostCreateEnvironmentVariableGroupPathParams = {
  /**
   * @type string, uuid
   */
  stackId: string
}

/**
 * @description Created
 */
export type PostCreateEnvironmentVariableGroup201 = any

export type PostCreateEnvironmentVariableGroupMutationRequest = CreateStackEnvironmentVariableGroupCommand

export type PostCreateEnvironmentVariableGroupMutationResponse = PostCreateEnvironmentVariableGroup201

export type PostCreateEnvironmentVariableGroupMutation = {
  Response: PostCreateEnvironmentVariableGroup201
  Request: PostCreateEnvironmentVariableGroupMutationRequest
  PathParams: PostCreateEnvironmentVariableGroupPathParams
  Errors: any
}