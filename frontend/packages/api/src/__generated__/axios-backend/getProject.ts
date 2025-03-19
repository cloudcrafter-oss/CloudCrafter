import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { GetProjectQueryResponse, GetProjectPathParams, GetProject404 } from '../types/GetProject'

export function getGetProjectUrl(id: GetProjectPathParams['id']) {
  return `/api/Projects/${id}` as const
}

/**
 * {@link /api/Projects/:id}
 */
export async function getProject(id: GetProjectPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetProjectQueryResponse, ResponseErrorConfig<GetProject404>, unknown>({
    method: 'GET',
    url: getGetProjectUrl(id).toString(),
    ...requestConfig,
  })
  return res.data
}