import type { CheckValidGitRepoCommandCommand } from './CheckValidGitRepoCommandCommand'
import type { GitRepositoryCheckResultDto } from './GitRepositoryCheckResultDto'

/**
 * @description OK
 */
export type PostValidateGithubRepo200 = GitRepositoryCheckResultDto

export type PostValidateGithubRepoMutationRequest = CheckValidGitRepoCommandCommand

export type PostValidateGithubRepoMutationResponse = PostValidateGithubRepo200

export type PostValidateGithubRepoMutation = {
  Response: PostValidateGithubRepo200
  Request: PostValidateGithubRepoMutationRequest
  Errors: any
}