import client from '@kubb/plugin-client/clients/axios'
import type {
  PostCreateStackServiceVolumeMutationRequest,
  PostCreateStackServiceVolumeMutationResponse,
  PostCreateStackServiceVolumePathParams,
} from '../types/PostCreateStackServiceVolume'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getPostCreateStackServiceVolumeUrl(
  stackId: PostCreateStackServiceVolumePathParams['stackId'],
  stackServiceId: PostCreateStackServiceVolumePathParams['stackServiceId'],
) {
  return `/api/Stacks/${stackId}/services/${stackServiceId}/volumes` as const
}

/**
 * {@link /api/Stacks/:stackId/services/:stackServiceId/volumes}
 */
export async function postCreateStackServiceVolume(
  stackId: PostCreateStackServiceVolumePathParams['stackId'],
  stackServiceId: PostCreateStackServiceVolumePathParams['stackServiceId'],
  data: PostCreateStackServiceVolumeMutationRequest,
  config: Partial<RequestConfig<PostCreateStackServiceVolumeMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PostCreateStackServiceVolumeMutationResponse, ResponseErrorConfig<Error>, PostCreateStackServiceVolumeMutationRequest>({
    method: 'POST',
    url: getPostCreateStackServiceVolumeUrl(stackId, stackServiceId).toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}