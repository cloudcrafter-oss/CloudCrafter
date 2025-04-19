import client from '@kubb/plugin-client/clients/axios'
import type { GetMyTeamsWithProjectsAndEnvironmentsQueryResponse } from '../types/GetMyTeamsWithProjectsAndEnvironments'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getGetMyTeamsWithProjectsAndEnvironmentsUrl() {
  return `/api/Teams/projects-and-environments` as const
}

/**
 * {@link /api/Teams/projects-and-environments}
 */
export async function getMyTeamsWithProjectsAndEnvironments(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetMyTeamsWithProjectsAndEnvironmentsQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetMyTeamsWithProjectsAndEnvironmentsUrl().toString(),
    ...requestConfig,
  })
  return res.data
}