import client from '@kubb/plugin-client/clients/axios'
import type { GetMyTeamsQueryResponse } from '../types/GetMyTeams'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getGetMyTeamsUrl() {
  return `/api/Teams` as const
}

/**
 * {@link /api/Teams}
 */
export async function getMyTeams(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetMyTeamsQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetMyTeamsUrl().toString(),
    ...requestConfig,
  })
  return res.data
}