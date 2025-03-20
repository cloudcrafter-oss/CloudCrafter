import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { PostCreateUserMutationRequest, PostCreateUserMutationResponse } from '../types/PostCreateUser'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postCreateUser } from '../axios-backend/postCreateUser'
import { useMutation } from '@tanstack/react-query'

export const postCreateUserMutationKey = () => [{ url: '/api/Auth/create' }] as const

export type PostCreateUserMutationKey = ReturnType<typeof postCreateUserMutationKey>

/**
 * {@link /api/Auth/create}
 */
export function usePostCreateUserHook<TContext>(
  options: {
    mutation?: UseMutationOptions<PostCreateUserMutationResponse, ResponseErrorConfig<Error>, { data: PostCreateUserMutationRequest }, TContext>
    client?: Partial<RequestConfig<PostCreateUserMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postCreateUserMutationKey()

  return useMutation<PostCreateUserMutationResponse, ResponseErrorConfig<Error>, { data: PostCreateUserMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return postCreateUser(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}