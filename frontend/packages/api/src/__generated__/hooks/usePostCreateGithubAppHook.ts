import client from '@cloudcrafter/api/client'
import type { PostCreateGithubAppMutationRequest, PostCreateGithubAppMutationResponse, PostCreateGithubApp400 } from '../types/PostCreateGithubApp'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postCreateGithubApp } from '../axios-backend/postCreateGithubApp'
import { useMutation } from '@tanstack/react-query'

export const postCreateGithubAppMutationKey = () => [{ url: '/api/Providers' }] as const

export type PostCreateGithubAppMutationKey = ReturnType<typeof postCreateGithubAppMutationKey>

/**
 * {@link /api/Providers}
 */
export function usePostCreateGithubAppHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      PostCreateGithubAppMutationResponse,
      ResponseErrorConfig<PostCreateGithubApp400>,
      { data: PostCreateGithubAppMutationRequest },
      TContext
    >
    client?: Partial<RequestConfig<PostCreateGithubAppMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postCreateGithubAppMutationKey()

  return useMutation<PostCreateGithubAppMutationResponse, ResponseErrorConfig<PostCreateGithubApp400>, { data: PostCreateGithubAppMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return postCreateGithubApp(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}