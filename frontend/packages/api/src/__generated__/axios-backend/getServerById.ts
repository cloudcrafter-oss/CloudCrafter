import client from '@cloudcrafter/api/client'
import type { GetServerByIdQueryResponse, GetServerByIdPathParams } from '../types/GetServerById'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getGetServerByIdUrl(id: GetServerByIdPathParams['id']) {
  return `/api/Servers/${id}` as const
}

/**
 * {@link /api/Servers/:id}
 */
export async function getServerById(id: GetServerByIdPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetServerByIdQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetServerByIdUrl(id).toString(),
    ...requestConfig,
  })
  return res.data
}