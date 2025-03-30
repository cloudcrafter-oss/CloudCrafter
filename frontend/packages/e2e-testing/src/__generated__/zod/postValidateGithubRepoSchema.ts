import { checkValidGitRepoCommandSchema } from './checkValidGitRepoCommandSchema'
import { gitRepositoryCheckResultDtoSchema } from './gitRepositoryCheckResultDtoSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const postValidateGithubRepo200Schema = z.lazy(() => gitRepositoryCheckResultDtoSchema)

export const postValidateGithubRepoMutationRequestSchema = z.lazy(() => checkValidGitRepoCommandSchema)

export const postValidateGithubRepoMutationResponseSchema = z.lazy(() => postValidateGithubRepo200Schema)