import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { GetDeploymentsForStackQueryResponse, GetDeploymentsForStackPathParams } from '../types/GetDeploymentsForStack'

export function getGetDeploymentsForStackUrl(id: GetDeploymentsForStackPathParams['id']) {
  return `/api/Stacks/${id}/deployments` as const
}

/**
 * {@link /api/Stacks/:id/deployments}
 */
export async function getDeploymentsForStack(id: GetDeploymentsForStackPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetDeploymentsForStackQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetDeploymentsForStackUrl(id).toString(),
    ...requestConfig,
  })
  return res.data
}