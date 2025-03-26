import client from '@cloudcrafter/api/client'
import type { GetEnvironmentVariableGroupsQueryResponse, GetEnvironmentVariableGroupsPathParams } from '../types/GetEnvironmentVariableGroups'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getGetEnvironmentVariableGroupsUrl(stackId: GetEnvironmentVariableGroupsPathParams['stackId']) {
  return `/api/Stacks/${stackId}/environment-variable-groups` as const
}

/**
 * {@link /api/Stacks/:stackId/environment-variable-groups}
 */
export async function getEnvironmentVariableGroups(
  stackId: GetEnvironmentVariableGroupsPathParams['stackId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetEnvironmentVariableGroupsQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetEnvironmentVariableGroupsUrl(stackId).toString(),
    ...requestConfig,
  })
  return res.data
}