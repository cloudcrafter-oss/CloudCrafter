import type { CheckValidGitRepoCommandCommand } from './CheckValidGitRepoCommandCommand'
import type { GitRepositoryCheckResultDto } from './GitRepositoryCheckResultDto'

/**
 * @description OK
 */
export type PostValidateGithubRepo200 = GitRepositoryCheckResultDto
export type PostValidateGithubRepoMutationRequest =
	CheckValidGitRepoCommandCommand
/**
 * @description OK
 */
export type PostValidateGithubRepoMutationResponse = GitRepositoryCheckResultDto
export type PostValidateGithubRepoMutation = {
	Response: PostValidateGithubRepoMutationResponse
	Request: PostValidateGithubRepoMutationRequest
}
