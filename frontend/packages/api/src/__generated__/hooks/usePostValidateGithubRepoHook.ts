import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { PostValidateGithubRepoMutationRequest, PostValidateGithubRepoMutationResponse } from '../types/PostValidateGithubRepo'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postValidateGithubRepo } from '../axios-backend/postValidateGithubRepo'
import { useMutation } from '@tanstack/react-query'

export const postValidateGithubRepoMutationKey = () => [{ url: '/api/Utils/validate-git-repository' }] as const

export type PostValidateGithubRepoMutationKey = ReturnType<typeof postValidateGithubRepoMutationKey>

/**
 * {@link /api/Utils/validate-git-repository}
 */
export function usePostValidateGithubRepoHook<TContext>(
  options: {
    mutation?: UseMutationOptions<PostValidateGithubRepoMutationResponse, ResponseErrorConfig<Error>, { data: PostValidateGithubRepoMutationRequest }, TContext>
    client?: Partial<RequestConfig<PostValidateGithubRepoMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postValidateGithubRepoMutationKey()

  return useMutation<PostValidateGithubRepoMutationResponse, ResponseErrorConfig<Error>, { data: PostValidateGithubRepoMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return postValidateGithubRepo(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}