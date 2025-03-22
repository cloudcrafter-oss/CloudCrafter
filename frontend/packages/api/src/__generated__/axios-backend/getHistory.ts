import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { GetHistoryQueryResponse, GetHistoryPathParams, GetHistoryQueryParams } from '../types/GetHistory'

export function getGetHistoryUrl(stackId: GetHistoryPathParams['stackId']) {
  return `/api/Stacks/${stackId}/environment-variables/history` as const
}

/**
 * {@link /api/Stacks/:stackId/environment-variables/history}
 */
export async function getHistory(
  stackId: GetHistoryPathParams['stackId'],
  params?: GetHistoryQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetHistoryQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetHistoryUrl(stackId).toString(),
    params,
    ...requestConfig,
  })
  return res.data
}