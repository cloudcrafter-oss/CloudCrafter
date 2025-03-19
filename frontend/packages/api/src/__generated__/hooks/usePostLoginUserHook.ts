import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { PostLoginUserMutationRequest, PostLoginUserMutationResponse } from '../types/PostLoginUser'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postLoginUser } from '../axios-backend/postLoginUser'
import { useMutation } from '@tanstack/react-query'

export const postLoginUserMutationKey = () => [{ url: '/api/Auth/login' }] as const

export type PostLoginUserMutationKey = ReturnType<typeof postLoginUserMutationKey>

/**
 * {@link /api/Auth/login}
 */
export function usePostLoginUserHook<TContext>(
  options: {
    mutation?: UseMutationOptions<PostLoginUserMutationResponse, ResponseErrorConfig<Error>, { data: PostLoginUserMutationRequest }, TContext>
    client?: Partial<RequestConfig<PostLoginUserMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postLoginUserMutationKey()

  return useMutation<PostLoginUserMutationResponse, ResponseErrorConfig<Error>, { data: PostLoginUserMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return postLoginUser(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}