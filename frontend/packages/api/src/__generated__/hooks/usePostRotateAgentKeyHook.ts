import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { PostRotateAgentKeyMutationResponse, PostRotateAgentKeyPathParams } from '../types/PostRotateAgentKey'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postRotateAgentKey } from '../axios-backend/postRotateAgentKey'
import { useMutation } from '@tanstack/react-query'

export const postRotateAgentKeyMutationKey = () => [{ url: '/api/Servers/{id}/rotate-key' }] as const

export type PostRotateAgentKeyMutationKey = ReturnType<typeof postRotateAgentKeyMutationKey>

/**
 * {@link /api/Servers/:id/rotate-key}
 */
export function usePostRotateAgentKeyHook<TContext>(
  options: {
    mutation?: UseMutationOptions<PostRotateAgentKeyMutationResponse, ResponseErrorConfig<Error>, { id: PostRotateAgentKeyPathParams['id'] }, TContext>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postRotateAgentKeyMutationKey()

  return useMutation<PostRotateAgentKeyMutationResponse, ResponseErrorConfig<Error>, { id: PostRotateAgentKeyPathParams['id'] }, TContext>({
    mutationFn: async ({ id }) => {
      return postRotateAgentKey(id, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}