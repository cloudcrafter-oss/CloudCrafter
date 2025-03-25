import type { CreateGithubProviderCommand } from './CreateGithubProviderCommand'
import type { ProblemDetails } from './ProblemDetails'

/**
 * @description Created
 */
export type PostCreateGithubApp201 = any

/**
 * @description Bad Request
 */
export type PostCreateGithubApp400 = ProblemDetails

export type PostCreateGithubAppMutationRequest = CreateGithubProviderCommand

export type PostCreateGithubAppMutationResponse = PostCreateGithubApp201

export type PostCreateGithubAppMutation = {
  Response: PostCreateGithubApp201
  Request: PostCreateGithubAppMutationRequest
  Errors: PostCreateGithubApp400
}