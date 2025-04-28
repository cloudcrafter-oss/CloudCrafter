import client from '@kubb/plugin-client/clients/axios'
import type { GetTeamMembersQueryResponse, GetTeamMembersPathParams, GetTeamMembersQueryParams } from '../types/GetTeamMembers'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getGetTeamMembersUrl(teamId: GetTeamMembersPathParams['teamId']) {
  return `/api/Teams/${teamId}` as const
}

/**
 * {@link /api/Teams/:teamId}
 */
export async function getTeamMembers(
  teamId: GetTeamMembersPathParams['teamId'],
  params?: GetTeamMembersQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetTeamMembersQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetTeamMembersUrl(teamId).toString(),
    params,
    ...requestConfig,
  })
  return res.data
}