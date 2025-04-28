import client from '@cloudcrafter/api/client'
import type { RemoveUserFromTeamMutationRequest, RemoveUserFromTeamMutationResponse, RemoveUserFromTeamPathParams } from '../types/RemoveUserFromTeam'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getRemoveUserFromTeamUrl(teamId: RemoveUserFromTeamPathParams['teamId']) {
  return `/api/Teams/${teamId}/remove` as const
}

/**
 * {@link /api/Teams/:teamId/remove}
 */
export async function removeUserFromTeam(
  teamId: RemoveUserFromTeamPathParams['teamId'],
  data: RemoveUserFromTeamMutationRequest,
  config: Partial<RequestConfig<RemoveUserFromTeamMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<RemoveUserFromTeamMutationResponse, ResponseErrorConfig<Error>, RemoveUserFromTeamMutationRequest>({
    method: 'DELETE',
    url: getRemoveUserFromTeamUrl(teamId).toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}