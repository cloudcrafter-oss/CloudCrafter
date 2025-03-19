import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { GetProvidersQueryResponse, GetProvidersQueryParams } from '../types/GetProviders'

export function getGetProvidersUrl() {
  return `/api/Providers` as const
}

/**
 * {@link /api/Providers}
 */
export async function getProviders(params?: GetProvidersQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetProvidersQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetProvidersUrl().toString(),
    params,
    ...requestConfig,
  })
  return res.data
}