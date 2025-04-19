import client from '@kubb/plugin-client/clients/axios'
import type { GetAllTeamsQueryResponse } from '../types/GetAllTeams'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getGetAllTeamsUrl() {
  return `/api/Teams/all` as const
}

/**
 * {@link /api/Teams/all}
 */
export async function getAllTeams(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetAllTeamsQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetAllTeamsUrl().toString(),
    ...requestConfig,
  })
  return res.data
}