import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { PostCreateStackMutationRequest, PostCreateStackMutationResponse } from '../types/PostCreateStack'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postCreateStack } from '../axios-backend/postCreateStack'
import { useMutation } from '@tanstack/react-query'

export const postCreateStackMutationKey = () => [{ url: '/api/Stacks' }] as const

export type PostCreateStackMutationKey = ReturnType<typeof postCreateStackMutationKey>

/**
 * {@link /api/Stacks}
 */
export function usePostCreateStackHook<TContext>(
  options: {
    mutation?: UseMutationOptions<PostCreateStackMutationResponse, ResponseErrorConfig<Error>, { data: PostCreateStackMutationRequest }, TContext>
    client?: Partial<RequestConfig<PostCreateStackMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postCreateStackMutationKey()

  return useMutation<PostCreateStackMutationResponse, ResponseErrorConfig<Error>, { data: PostCreateStackMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return postCreateStack(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}