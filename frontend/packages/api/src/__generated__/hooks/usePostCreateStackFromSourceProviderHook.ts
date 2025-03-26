import client from '@cloudcrafter/api/client'
import type {
  PostCreateStackFromSourceProviderMutationRequest,
  PostCreateStackFromSourceProviderMutationResponse,
} from '../types/PostCreateStackFromSourceProvider'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postCreateStackFromSourceProvider } from '../axios-backend/postCreateStackFromSourceProvider'
import { useMutation } from '@tanstack/react-query'

export const postCreateStackFromSourceProviderMutationKey = () => [{ url: '/api/Stacks/provider' }] as const

export type PostCreateStackFromSourceProviderMutationKey = ReturnType<typeof postCreateStackFromSourceProviderMutationKey>

/**
 * {@link /api/Stacks/provider}
 */
export function usePostCreateStackFromSourceProviderHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      PostCreateStackFromSourceProviderMutationResponse,
      ResponseErrorConfig<Error>,
      { data: PostCreateStackFromSourceProviderMutationRequest },
      TContext
    >
    client?: Partial<RequestConfig<PostCreateStackFromSourceProviderMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postCreateStackFromSourceProviderMutationKey()

  return useMutation<
    PostCreateStackFromSourceProviderMutationResponse,
    ResponseErrorConfig<Error>,
    { data: PostCreateStackFromSourceProviderMutationRequest },
    TContext
  >({
    mutationFn: async ({ data }) => {
      return postCreateStackFromSourceProvider(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}