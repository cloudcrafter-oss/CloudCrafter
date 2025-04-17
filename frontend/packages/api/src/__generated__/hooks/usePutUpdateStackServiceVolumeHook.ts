import client from '@cloudcrafter/api/client'
import type {
  PutUpdateStackServiceVolumeMutationRequest,
  PutUpdateStackServiceVolumeMutationResponse,
  PutUpdateStackServiceVolumePathParams,
  PutUpdateStackServiceVolume400,
} from '../types/PutUpdateStackServiceVolume'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { putUpdateStackServiceVolume } from '../axios-backend/putUpdateStackServiceVolume'
import { useMutation } from '@tanstack/react-query'

export const putUpdateStackServiceVolumeMutationKey = () => [{ url: '/api/Stacks/{stackId}/services/{stackServiceId}/volumes/{id}' }] as const

export type PutUpdateStackServiceVolumeMutationKey = ReturnType<typeof putUpdateStackServiceVolumeMutationKey>

/**
 * {@link /api/Stacks/:stackId/services/:stackServiceId/volumes/:id}
 */
export function usePutUpdateStackServiceVolumeHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      PutUpdateStackServiceVolumeMutationResponse,
      ResponseErrorConfig<PutUpdateStackServiceVolume400>,
      {
        stackId: PutUpdateStackServiceVolumePathParams['stackId']
        stackServiceId: PutUpdateStackServiceVolumePathParams['stackServiceId']
        id: PutUpdateStackServiceVolumePathParams['id']
        data: PutUpdateStackServiceVolumeMutationRequest
      },
      TContext
    >
    client?: Partial<RequestConfig<PutUpdateStackServiceVolumeMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? putUpdateStackServiceVolumeMutationKey()

  return useMutation<
    PutUpdateStackServiceVolumeMutationResponse,
    ResponseErrorConfig<PutUpdateStackServiceVolume400>,
    {
      stackId: PutUpdateStackServiceVolumePathParams['stackId']
      stackServiceId: PutUpdateStackServiceVolumePathParams['stackServiceId']
      id: PutUpdateStackServiceVolumePathParams['id']
      data: PutUpdateStackServiceVolumeMutationRequest
    },
    TContext
  >({
    mutationFn: async ({ stackId, stackServiceId, id, data }) => {
      return putUpdateStackServiceVolume(stackId, stackServiceId, id, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}