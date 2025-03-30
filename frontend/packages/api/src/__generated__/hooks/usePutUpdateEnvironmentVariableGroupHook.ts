import client from '@cloudcrafter/api/client'
import type {
  PutUpdateEnvironmentVariableGroupMutationRequest,
  PutUpdateEnvironmentVariableGroupMutationResponse,
  PutUpdateEnvironmentVariableGroupPathParams,
  PutUpdateEnvironmentVariableGroup400,
} from '../types/PutUpdateEnvironmentVariableGroup'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { putUpdateEnvironmentVariableGroup } from '../axios-backend/putUpdateEnvironmentVariableGroup'
import { useMutation } from '@tanstack/react-query'

export const putUpdateEnvironmentVariableGroupMutationKey = () => [{ url: '/api/Stacks/{stackId}/environment-variable-groups/{id}' }] as const

export type PutUpdateEnvironmentVariableGroupMutationKey = ReturnType<typeof putUpdateEnvironmentVariableGroupMutationKey>

/**
 * {@link /api/Stacks/:stackId/environment-variable-groups/:id}
 */
export function usePutUpdateEnvironmentVariableGroupHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      PutUpdateEnvironmentVariableGroupMutationResponse,
      ResponseErrorConfig<PutUpdateEnvironmentVariableGroup400>,
      {
        stackId: PutUpdateEnvironmentVariableGroupPathParams['stackId']
        id: PutUpdateEnvironmentVariableGroupPathParams['id']
        data: PutUpdateEnvironmentVariableGroupMutationRequest
      },
      TContext
    >
    client?: Partial<RequestConfig<PutUpdateEnvironmentVariableGroupMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? putUpdateEnvironmentVariableGroupMutationKey()

  return useMutation<
    PutUpdateEnvironmentVariableGroupMutationResponse,
    ResponseErrorConfig<PutUpdateEnvironmentVariableGroup400>,
    {
      stackId: PutUpdateEnvironmentVariableGroupPathParams['stackId']
      id: PutUpdateEnvironmentVariableGroupPathParams['id']
      data: PutUpdateEnvironmentVariableGroupMutationRequest
    },
    TContext
  >({
    mutationFn: async ({ stackId, id, data }) => {
      return putUpdateEnvironmentVariableGroup(stackId, id, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}