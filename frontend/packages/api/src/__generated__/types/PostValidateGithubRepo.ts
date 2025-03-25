import type { CheckValidGitRepoCommand } from './CheckValidGitRepoCommand'
import type { GitRepositoryCheckResultDto } from './GitRepositoryCheckResultDto'

/**
 * @description OK
 */
export type PostValidateGithubRepo200 = GitRepositoryCheckResultDto

export type PostValidateGithubRepoMutationRequest = CheckValidGitRepoCommand

export type PostValidateGithubRepoMutationResponse = PostValidateGithubRepo200

export type PostValidateGithubRepoMutation = {
  Response: PostValidateGithubRepo200
  Request: PostValidateGithubRepoMutationRequest
  Errors: any
}