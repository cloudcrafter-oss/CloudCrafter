import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type {
  GetExportEnvironmentVariablesQueryResponse,
  GetExportEnvironmentVariablesPathParams,
  GetExportEnvironmentVariablesQueryParams,
} from '../types/GetExportEnvironmentVariables'

export function getGetExportEnvironmentVariablesUrl(stackId: GetExportEnvironmentVariablesPathParams['stackId']) {
  return `/api/Stacks/${stackId}/environment-variables/export` as const
}

/**
 * {@link /api/Stacks/:stackId/environment-variables/export}
 */
export async function getExportEnvironmentVariables(
  stackId: GetExportEnvironmentVariablesPathParams['stackId'],
  params?: GetExportEnvironmentVariablesQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetExportEnvironmentVariablesQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetExportEnvironmentVariablesUrl(stackId).toString(),
    params,
    ...requestConfig,
  })
  return res.data
}