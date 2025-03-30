import client from '@cloudcrafter/api/client'
import type { DeleteEnvironmentVariableGroupMutationResponse, DeleteEnvironmentVariableGroupPathParams } from '../types/DeleteEnvironmentVariableGroup'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { deleteEnvironmentVariableGroup } from '../axios-backend/deleteEnvironmentVariableGroup'
import { useMutation } from '@tanstack/react-query'

export const deleteEnvironmentVariableGroupMutationKey = () => [{ url: '/api/Stacks/{stackId}/environment-variable-groups/{id}' }] as const

export type DeleteEnvironmentVariableGroupMutationKey = ReturnType<typeof deleteEnvironmentVariableGroupMutationKey>

/**
 * {@link /api/Stacks/:stackId/environment-variable-groups/:id}
 */
export function useDeleteEnvironmentVariableGroupHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      DeleteEnvironmentVariableGroupMutationResponse,
      ResponseErrorConfig<Error>,
      { stackId: DeleteEnvironmentVariableGroupPathParams['stackId']; id: DeleteEnvironmentVariableGroupPathParams['id'] },
      TContext
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? deleteEnvironmentVariableGroupMutationKey()

  return useMutation<
    DeleteEnvironmentVariableGroupMutationResponse,
    ResponseErrorConfig<Error>,
    { stackId: DeleteEnvironmentVariableGroupPathParams['stackId']; id: DeleteEnvironmentVariableGroupPathParams['id'] },
    TContext
  >({
    mutationFn: async ({ stackId, id }) => {
      return deleteEnvironmentVariableGroup(stackId, id, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}