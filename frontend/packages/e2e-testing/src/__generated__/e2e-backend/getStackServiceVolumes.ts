import client from '@kubb/plugin-client/clients/axios'
import type { GetStackServiceVolumesQueryResponse, GetStackServiceVolumesPathParams } from '../types/GetStackServiceVolumes'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getGetStackServiceVolumesUrl(
  stackId: GetStackServiceVolumesPathParams['stackId'],
  stackServiceId: GetStackServiceVolumesPathParams['stackServiceId'],
) {
  return `/api/Stacks/${stackId}/services/${stackServiceId}/volumes` as const
}

/**
 * {@link /api/Stacks/:stackId/services/:stackServiceId/volumes}
 */
export async function getStackServiceVolumes(
  stackId: GetStackServiceVolumesPathParams['stackId'],
  stackServiceId: GetStackServiceVolumesPathParams['stackServiceId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetStackServiceVolumesQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetStackServiceVolumesUrl(stackId, stackServiceId).toString(),
    ...requestConfig,
  })
  return res.data
}