import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type {
  PostCreateEnvironmentVariableMutationRequest,
  PostCreateEnvironmentVariableMutationResponse,
  PostCreateEnvironmentVariablePathParams,
} from '../types/PostCreateEnvironmentVariable'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postCreateEnvironmentVariable } from '../axios-backend/postCreateEnvironmentVariable'
import { useMutation } from '@tanstack/react-query'

export const postCreateEnvironmentVariableMutationKey = () => [{ url: '/api/Stacks/{stackId}/environment-variables' }] as const

export type PostCreateEnvironmentVariableMutationKey = ReturnType<typeof postCreateEnvironmentVariableMutationKey>

/**
 * {@link /api/Stacks/:stackId/environment-variables}
 */
export function usePostCreateEnvironmentVariableHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      PostCreateEnvironmentVariableMutationResponse,
      ResponseErrorConfig<Error>,
      { stackId: PostCreateEnvironmentVariablePathParams['stackId']; data: PostCreateEnvironmentVariableMutationRequest },
      TContext
    >
    client?: Partial<RequestConfig<PostCreateEnvironmentVariableMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postCreateEnvironmentVariableMutationKey()

  return useMutation<
    PostCreateEnvironmentVariableMutationResponse,
    ResponseErrorConfig<Error>,
    { stackId: PostCreateEnvironmentVariablePathParams['stackId']; data: PostCreateEnvironmentVariableMutationRequest },
    TContext
  >({
    mutationFn: async ({ stackId, data }) => {
      return postCreateEnvironmentVariable(stackId, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}