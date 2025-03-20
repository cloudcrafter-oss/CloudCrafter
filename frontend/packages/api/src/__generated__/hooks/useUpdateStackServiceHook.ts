import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { UpdateStackServiceMutationRequest, UpdateStackServiceMutationResponse, UpdateStackServicePathParams } from '../types/UpdateStackService'
import type { UseMutationOptions } from '@tanstack/react-query'
import { updateStackService } from '../axios-backend/updateStackService'
import { useMutation } from '@tanstack/react-query'

export const updateStackServiceMutationKey = () => [{ url: '/api/Stacks/{stackId}/services/{stackServiceId}' }] as const

export type UpdateStackServiceMutationKey = ReturnType<typeof updateStackServiceMutationKey>

/**
 * {@link /api/Stacks/:stackId/services/:stackServiceId}
 */
export function useUpdateStackServiceHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      UpdateStackServiceMutationResponse,
      ResponseErrorConfig<Error>,
      {
        stackId: UpdateStackServicePathParams['stackId']
        stackServiceId: UpdateStackServicePathParams['stackServiceId']
        data: UpdateStackServiceMutationRequest
      },
      TContext
    >
    client?: Partial<RequestConfig<UpdateStackServiceMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? updateStackServiceMutationKey()

  return useMutation<
    UpdateStackServiceMutationResponse,
    ResponseErrorConfig<Error>,
    {
      stackId: UpdateStackServicePathParams['stackId']
      stackServiceId: UpdateStackServicePathParams['stackServiceId']
      data: UpdateStackServiceMutationRequest
    },
    TContext
  >({
    mutationFn: async ({ stackId, stackServiceId, data }) => {
      return updateStackService(stackId, stackServiceId, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}