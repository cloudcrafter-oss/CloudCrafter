import type { CreateStackCommand } from './CreateStackCommand'
import type { StackCreatedDto } from './StackCreatedDto'

/**
 * @description OK
 */
export type PostCreateStack200 = StackCreatedDto

export type PostCreateStackMutationRequest = CreateStackCommand

export type PostCreateStackMutationResponse = PostCreateStack200

export type PostCreateStackMutation = {
  Response: PostCreateStack200
  Request: PostCreateStackMutationRequest
  Errors: any
}