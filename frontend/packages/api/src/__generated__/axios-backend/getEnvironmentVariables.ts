import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type {
  GetEnvironmentVariablesQueryResponse,
  GetEnvironmentVariablesPathParams,
  GetEnvironmentVariablesQueryParams,
} from '../types/GetEnvironmentVariables'

export function getGetEnvironmentVariablesUrl(stackId: GetEnvironmentVariablesPathParams['stackId']) {
  return `/api/Stacks/${stackId}/environment-variables` as const
}

/**
 * {@link /api/Stacks/:stackId/environment-variables}
 */
export async function getEnvironmentVariables(
  stackId: GetEnvironmentVariablesPathParams['stackId'],
  params?: GetEnvironmentVariablesQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetEnvironmentVariablesQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetEnvironmentVariablesUrl(stackId).toString(),
    params,
    ...requestConfig,
  })
  return res.data
}