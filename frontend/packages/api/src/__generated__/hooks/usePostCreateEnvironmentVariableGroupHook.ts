import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type {
  PostCreateEnvironmentVariableGroupMutationRequest,
  PostCreateEnvironmentVariableGroupMutationResponse,
  PostCreateEnvironmentVariableGroupPathParams,
} from '../types/PostCreateEnvironmentVariableGroup'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postCreateEnvironmentVariableGroup } from '../axios-backend/postCreateEnvironmentVariableGroup'
import { useMutation } from '@tanstack/react-query'

export const postCreateEnvironmentVariableGroupMutationKey = () => [{ url: '/api/Stacks/{stackId}/environment-variable-groups' }] as const

export type PostCreateEnvironmentVariableGroupMutationKey = ReturnType<typeof postCreateEnvironmentVariableGroupMutationKey>

/**
 * {@link /api/Stacks/:stackId/environment-variable-groups}
 */
export function usePostCreateEnvironmentVariableGroupHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      PostCreateEnvironmentVariableGroupMutationResponse,
      ResponseErrorConfig<Error>,
      { stackId: PostCreateEnvironmentVariableGroupPathParams['stackId']; data: PostCreateEnvironmentVariableGroupMutationRequest },
      TContext
    >
    client?: Partial<RequestConfig<PostCreateEnvironmentVariableGroupMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postCreateEnvironmentVariableGroupMutationKey()

  return useMutation<
    PostCreateEnvironmentVariableGroupMutationResponse,
    ResponseErrorConfig<Error>,
    { stackId: PostCreateEnvironmentVariableGroupPathParams['stackId']; data: PostCreateEnvironmentVariableGroupMutationRequest },
    TContext
  >({
    mutationFn: async ({ stackId, data }) => {
      return postCreateEnvironmentVariableGroup(stackId, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}