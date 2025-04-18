import client from '@cloudcrafter/api/client'
import type { DeleteEnvironmentVariableMutationResponse, DeleteEnvironmentVariablePathParams } from '../types/DeleteEnvironmentVariable'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { deleteEnvironmentVariable } from '../axios-backend/deleteEnvironmentVariable'
import { useMutation } from '@tanstack/react-query'

export const deleteEnvironmentVariableMutationKey = () => [{ url: '/api/Stacks/{stackId}/environment-variables/{id}' }] as const

export type DeleteEnvironmentVariableMutationKey = ReturnType<typeof deleteEnvironmentVariableMutationKey>

/**
 * {@link /api/Stacks/:stackId/environment-variables/:id}
 */
export function useDeleteEnvironmentVariableHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      DeleteEnvironmentVariableMutationResponse,
      ResponseErrorConfig<Error>,
      { stackId: DeleteEnvironmentVariablePathParams['stackId']; id: DeleteEnvironmentVariablePathParams['id'] },
      TContext
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? deleteEnvironmentVariableMutationKey()

  return useMutation<
    DeleteEnvironmentVariableMutationResponse,
    ResponseErrorConfig<Error>,
    { stackId: DeleteEnvironmentVariablePathParams['stackId']; id: DeleteEnvironmentVariablePathParams['id'] },
    TContext
  >({
    mutationFn: async ({ stackId, id }) => {
      return deleteEnvironmentVariable(stackId, id, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}