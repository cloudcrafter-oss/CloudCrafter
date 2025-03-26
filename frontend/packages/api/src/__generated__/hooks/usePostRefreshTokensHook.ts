import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { PostRefreshTokensMutationRequest, PostRefreshTokensMutationResponse } from '../types/PostRefreshTokens'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postRefreshTokens } from '../axios-backend/postRefreshTokens'
import { useMutation } from '@tanstack/react-query'

export const postRefreshTokensMutationKey = () => [{ url: '/api/Auth/refresh' }] as const

export type PostRefreshTokensMutationKey = ReturnType<typeof postRefreshTokensMutationKey>

/**
 * {@link /api/Auth/refresh}
 */
export function usePostRefreshTokensHook<TContext>(
  options: {
    mutation?: UseMutationOptions<PostRefreshTokensMutationResponse, ResponseErrorConfig<Error>, { data: PostRefreshTokensMutationRequest }, TContext>
    client?: Partial<RequestConfig<PostRefreshTokensMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postRefreshTokensMutationKey()

  return useMutation<PostRefreshTokensMutationResponse, ResponseErrorConfig<Error>, { data: PostRefreshTokensMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return postRefreshTokens(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}