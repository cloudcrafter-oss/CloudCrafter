import client from '@cloudcrafter/api/client'
import type { InviteUserToTeamMutationRequest, InviteUserToTeamMutationResponse, InviteUserToTeamPathParams } from '../types/InviteUserToTeam'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getInviteUserToTeamUrl(teamId: InviteUserToTeamPathParams['teamId']) {
  return `/api/Teams/${teamId}/invite` as const
}

/**
 * {@link /api/Teams/:teamId/invite}
 */
export async function inviteUserToTeam(
  teamId: InviteUserToTeamPathParams['teamId'],
  data: InviteUserToTeamMutationRequest,
  config: Partial<RequestConfig<InviteUserToTeamMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<InviteUserToTeamMutationResponse, ResponseErrorConfig<Error>, InviteUserToTeamMutationRequest>({
    method: 'POST',
    url: getInviteUserToTeamUrl(teamId).toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}