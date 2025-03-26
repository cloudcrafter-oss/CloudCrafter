import client from '@cloudcrafter/api/client'
import type {
  PutUpdateEnvironmentVariableMutationRequest,
  PutUpdateEnvironmentVariableMutationResponse,
  PutUpdateEnvironmentVariablePathParams,
  PutUpdateEnvironmentVariable400,
} from '../types/PutUpdateEnvironmentVariable'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { putUpdateEnvironmentVariable } from '../axios-backend/putUpdateEnvironmentVariable'
import { useMutation } from '@tanstack/react-query'

export const putUpdateEnvironmentVariableMutationKey = () => [{ url: '/api/Stacks/{stackId}/environment-variables/{id}' }] as const

export type PutUpdateEnvironmentVariableMutationKey = ReturnType<typeof putUpdateEnvironmentVariableMutationKey>

/**
 * {@link /api/Stacks/:stackId/environment-variables/:id}
 */
export function usePutUpdateEnvironmentVariableHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      PutUpdateEnvironmentVariableMutationResponse,
      ResponseErrorConfig<PutUpdateEnvironmentVariable400>,
      {
        stackId: PutUpdateEnvironmentVariablePathParams['stackId']
        id: PutUpdateEnvironmentVariablePathParams['id']
        data: PutUpdateEnvironmentVariableMutationRequest
      },
      TContext
    >
    client?: Partial<RequestConfig<PutUpdateEnvironmentVariableMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? putUpdateEnvironmentVariableMutationKey()

  return useMutation<
    PutUpdateEnvironmentVariableMutationResponse,
    ResponseErrorConfig<PutUpdateEnvironmentVariable400>,
    {
      stackId: PutUpdateEnvironmentVariablePathParams['stackId']
      id: PutUpdateEnvironmentVariablePathParams['id']
      data: PutUpdateEnvironmentVariableMutationRequest
    },
    TContext
  >({
    mutationFn: async ({ stackId, id, data }) => {
      return putUpdateEnvironmentVariable(stackId, id, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}