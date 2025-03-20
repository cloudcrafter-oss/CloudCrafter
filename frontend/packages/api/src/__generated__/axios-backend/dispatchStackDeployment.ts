import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { DispatchStackDeploymentMutationResponse, DispatchStackDeploymentPathParams } from '../types/DispatchStackDeployment'

export function getDispatchStackDeploymentUrl(id: DispatchStackDeploymentPathParams['id']) {
  return `/api/Stacks/${id}/deploy` as const
}

/**
 * {@link /api/Stacks/:id/deploy}
 */
export async function dispatchStackDeployment(id: DispatchStackDeploymentPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<DispatchStackDeploymentMutationResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'POST',
    url: getDispatchStackDeploymentUrl(id).toString(),
    ...requestConfig,
  })
  return res.data
}