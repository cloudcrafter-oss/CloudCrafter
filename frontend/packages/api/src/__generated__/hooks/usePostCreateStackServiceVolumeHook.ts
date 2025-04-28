import client from '@cloudcrafter/api/client'
import type {
  PostCreateStackServiceVolumeMutationRequest,
  PostCreateStackServiceVolumeMutationResponse,
  PostCreateStackServiceVolumePathParams,
} from '../types/PostCreateStackServiceVolume'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postCreateStackServiceVolume } from '../axios-backend/postCreateStackServiceVolume'
import { useMutation } from '@tanstack/react-query'

export const postCreateStackServiceVolumeMutationKey = () => [{ url: '/api/Stacks/{stackId}/services/{stackServiceId}/volumes' }] as const

export type PostCreateStackServiceVolumeMutationKey = ReturnType<typeof postCreateStackServiceVolumeMutationKey>

/**
 * {@link /api/Stacks/:stackId/services/:stackServiceId/volumes}
 */
export function usePostCreateStackServiceVolumeHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      PostCreateStackServiceVolumeMutationResponse,
      ResponseErrorConfig<Error>,
      {
        stackId: PostCreateStackServiceVolumePathParams['stackId']
        stackServiceId: PostCreateStackServiceVolumePathParams['stackServiceId']
        data: PostCreateStackServiceVolumeMutationRequest
      },
      TContext
    >
    client?: Partial<RequestConfig<PostCreateStackServiceVolumeMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postCreateStackServiceVolumeMutationKey()

  return useMutation<
    PostCreateStackServiceVolumeMutationResponse,
    ResponseErrorConfig<Error>,
    {
      stackId: PostCreateStackServiceVolumePathParams['stackId']
      stackServiceId: PostCreateStackServiceVolumePathParams['stackServiceId']
      data: PostCreateStackServiceVolumeMutationRequest
    },
    TContext
  >({
    mutationFn: async ({ stackId, stackServiceId, data }) => {
      return postCreateStackServiceVolume(stackId, stackServiceId, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}