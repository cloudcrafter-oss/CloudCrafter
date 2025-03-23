import type { CreateStackFromSourceProviderCommand } from './CreateStackFromSourceProviderCommand'
import type { StackCreatedDto } from './StackCreatedDto'

/**
 * @description OK
 */
export type PostCreateStackFromSourceProvider200 = StackCreatedDto

export type PostCreateStackFromSourceProviderMutationRequest = CreateStackFromSourceProviderCommand

export type PostCreateStackFromSourceProviderMutationResponse = PostCreateStackFromSourceProvider200

export type PostCreateStackFromSourceProviderMutation = {
  Response: PostCreateStackFromSourceProvider200
  Request: PostCreateStackFromSourceProviderMutationRequest
  Errors: any
}