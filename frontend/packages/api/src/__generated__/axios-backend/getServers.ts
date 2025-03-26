import client from '@cloudcrafter/client-auth/clients'
import type { GetServersQueryResponse } from '../types/GetServers'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/client-auth/clients'

export function getGetServersUrl() {
  return `/api/Servers` as const
}

/**
 * {@link /api/Servers}
 */
export async function getServers(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetServersQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetServersUrl().toString(),
    ...requestConfig,
  })
  return res.data
}