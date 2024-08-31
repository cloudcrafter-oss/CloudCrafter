import { z } from 'zod'
import { checkValidGitRepoCommandCommandSchema } from './checkValidGitRepoCommandCommandSchema'
import { gitRepositoryCheckResultDtoSchema } from './gitRepositoryCheckResultDtoSchema'

/**
 * @description OK
 */
export const postValidateGithubRepo200Schema = z.lazy(
	() => gitRepositoryCheckResultDtoSchema,
)

export const postValidateGithubRepoMutationRequestSchema = z.lazy(
	() => checkValidGitRepoCommandCommandSchema,
)
/**
 * @description OK
 */
export const postValidateGithubRepoMutationResponseSchema = z.lazy(
	() => gitRepositoryCheckResultDtoSchema,
)
