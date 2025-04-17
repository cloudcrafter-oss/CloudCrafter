import client from '@cloudcrafter/api/client'
import type { DeleteStackServiceVolumeMutationResponse, DeleteStackServiceVolumePathParams } from '../types/DeleteStackServiceVolume'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getDeleteStackServiceVolumeUrl(
  stackId: DeleteStackServiceVolumePathParams['stackId'],
  stackServiceId: DeleteStackServiceVolumePathParams['stackServiceId'],
  id: DeleteStackServiceVolumePathParams['id'],
) {
  return `/api/Stacks/${stackId}/services/${stackServiceId}/volumes/${id}` as const
}

/**
 * {@link /api/Stacks/:stackId/services/:stackServiceId/volumes/:id}
 */
export async function deleteStackServiceVolume(
  stackId: DeleteStackServiceVolumePathParams['stackId'],
  stackServiceId: DeleteStackServiceVolumePathParams['stackServiceId'],
  id: DeleteStackServiceVolumePathParams['id'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<DeleteStackServiceVolumeMutationResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'DELETE',
    url: getDeleteStackServiceVolumeUrl(stackId, stackServiceId, id).toString(),
    ...requestConfig,
  })
  return res.data
}