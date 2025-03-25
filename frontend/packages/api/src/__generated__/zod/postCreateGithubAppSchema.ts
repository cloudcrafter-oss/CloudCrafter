import { createGithubProviderCommandSchema } from './createGithubProviderCommandSchema'
import { problemDetailsSchema } from './problemDetailsSchema'
import { z } from 'zod'

/**
 * @description Created
 */
export const postCreateGithubApp201Schema = z.any()

/**
 * @description Bad Request
 */
export const postCreateGithubApp400Schema = z.lazy(() => problemDetailsSchema)

export const postCreateGithubAppMutationRequestSchema = z.lazy(() => createGithubProviderCommandSchema)

export const postCreateGithubAppMutationResponseSchema = z.lazy(() => postCreateGithubApp201Schema)