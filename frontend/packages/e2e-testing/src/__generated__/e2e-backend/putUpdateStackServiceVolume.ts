import client from '@kubb/plugin-client/clients/axios'
import type {
  PutUpdateStackServiceVolumeMutationRequest,
  PutUpdateStackServiceVolumeMutationResponse,
  PutUpdateStackServiceVolumePathParams,
  PutUpdateStackServiceVolume400,
} from '../types/PutUpdateStackServiceVolume'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getPutUpdateStackServiceVolumeUrl(
  stackId: PutUpdateStackServiceVolumePathParams['stackId'],
  stackServiceId: PutUpdateStackServiceVolumePathParams['stackServiceId'],
  id: PutUpdateStackServiceVolumePathParams['id'],
) {
  return `/api/Stacks/${stackId}/services/${stackServiceId}/volumes/${id}` as const
}

/**
 * {@link /api/Stacks/:stackId/services/:stackServiceId/volumes/:id}
 */
export async function putUpdateStackServiceVolume(
  stackId: PutUpdateStackServiceVolumePathParams['stackId'],
  stackServiceId: PutUpdateStackServiceVolumePathParams['stackServiceId'],
  id: PutUpdateStackServiceVolumePathParams['id'],
  data: PutUpdateStackServiceVolumeMutationRequest,
  config: Partial<RequestConfig<PutUpdateStackServiceVolumeMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<
    PutUpdateStackServiceVolumeMutationResponse,
    ResponseErrorConfig<PutUpdateStackServiceVolume400>,
    PutUpdateStackServiceVolumeMutationRequest
  >({
    method: 'PUT',
    url: getPutUpdateStackServiceVolumeUrl(stackId, stackServiceId, id).toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}