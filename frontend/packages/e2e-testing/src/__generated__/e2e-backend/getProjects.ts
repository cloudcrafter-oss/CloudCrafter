import client from '@kubb/plugin-client/clients/axios'
import type { GetProjectsQueryResponse, GetProjectsQueryParams } from '../types/GetProjects'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getGetProjectsUrl() {
  return `/api/Projects` as const
}

/**
 * {@link /api/Projects}
 */
export async function getProjects(params?: GetProjectsQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetProjectsQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetProjectsUrl().toString(),
    params,
    ...requestConfig,
  })
  return res.data
}