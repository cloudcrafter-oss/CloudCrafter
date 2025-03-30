import client from '@cloudcrafter/api/client'
import type { GetStackDetailQueryResponse, GetStackDetailPathParams, GetStackDetail404 } from '../types/GetStackDetail'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getGetStackDetailUrl(id: GetStackDetailPathParams['id']) {
  return `/api/Stacks/${id}` as const
}

/**
 * {@link /api/Stacks/:id}
 */
export async function getStackDetail(id: GetStackDetailPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetStackDetailQueryResponse, ResponseErrorConfig<GetStackDetail404>, unknown>({
    method: 'GET',
    url: getGetStackDetailUrl(id).toString(),
    ...requestConfig,
  })
  return res.data
}