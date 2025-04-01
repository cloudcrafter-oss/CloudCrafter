import client from '@cloudcrafter/api/client'
import type { DeleteStackServiceVolumeMutationResponse, DeleteStackServiceVolumePathParams } from '../types/DeleteStackServiceVolume'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { deleteStackServiceVolume } from '../axios-backend/deleteStackServiceVolume'
import { useMutation } from '@tanstack/react-query'

export const deleteStackServiceVolumeMutationKey = () => [{ url: '/api/Stacks/{stackId}/services/{stackServiceId}/volumes/{id}' }] as const

export type DeleteStackServiceVolumeMutationKey = ReturnType<typeof deleteStackServiceVolumeMutationKey>

/**
 * {@link /api/Stacks/:stackId/services/:stackServiceId/volumes/:id}
 */
export function useDeleteStackServiceVolumeHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      DeleteStackServiceVolumeMutationResponse,
      ResponseErrorConfig<Error>,
      {
        stackId: DeleteStackServiceVolumePathParams['stackId']
        stackServiceId: DeleteStackServiceVolumePathParams['stackServiceId']
        id: DeleteStackServiceVolumePathParams['id']
      },
      TContext
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? deleteStackServiceVolumeMutationKey()

  return useMutation<
    DeleteStackServiceVolumeMutationResponse,
    ResponseErrorConfig<Error>,
    {
      stackId: DeleteStackServiceVolumePathParams['stackId']
      stackServiceId: DeleteStackServiceVolumePathParams['stackServiceId']
      id: DeleteStackServiceVolumePathParams['id']
    },
    TContext
  >({
    mutationFn: async ({ stackId, stackServiceId, id }) => {
      return deleteStackServiceVolume(stackId, stackServiceId, id, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}