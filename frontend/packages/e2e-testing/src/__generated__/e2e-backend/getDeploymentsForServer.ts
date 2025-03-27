import client from '@kubb/plugin-client/clients/axios'
import type {
  GetDeploymentsForServerQueryResponse,
  GetDeploymentsForServerPathParams,
  GetDeploymentsForServerQueryParams,
} from '../types/GetDeploymentsForServer'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getGetDeploymentsForServerUrl(id: GetDeploymentsForServerPathParams['id']) {
  return `/api/Servers/${id}/deployments` as const
}

/**
 * {@link /api/Servers/:id/deployments}
 */
export async function getDeploymentsForServer(
  id: GetDeploymentsForServerPathParams['id'],
  params?: GetDeploymentsForServerQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetDeploymentsForServerQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetDeploymentsForServerUrl(id).toString(),
    params,
    ...requestConfig,
  })
  return res.data
}