import client from '@cloudcrafter/api/client'
import type { GetAllTeamsQueryResponse } from '../types/GetAllTeams'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

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