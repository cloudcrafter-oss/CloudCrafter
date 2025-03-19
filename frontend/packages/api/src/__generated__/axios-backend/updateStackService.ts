import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { UpdateStackServiceMutationRequest, UpdateStackServiceMutationResponse, UpdateStackServicePathParams } from '../types/UpdateStackService'

export function getUpdateStackServiceUrl(stackId: UpdateStackServicePathParams['stackId'], stackServiceId: UpdateStackServicePathParams['stackServiceId']) {
  return `/api/Stacks/${stackId}/services/${stackServiceId}` as const
}

/**
 * {@link /api/Stacks/:stackId/services/:stackServiceId}
 */
export async function updateStackService(
  stackId: UpdateStackServicePathParams['stackId'],
  stackServiceId: UpdateStackServicePathParams['stackServiceId'],
  data: UpdateStackServiceMutationRequest,
  config: Partial<RequestConfig<UpdateStackServiceMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<UpdateStackServiceMutationResponse, ResponseErrorConfig<Error>, UpdateStackServiceMutationRequest>({
    method: 'PATCH',
    url: getUpdateStackServiceUrl(stackId, stackServiceId).toString(),
    data,
    ...requestConfig,
  })
  return res.data
}