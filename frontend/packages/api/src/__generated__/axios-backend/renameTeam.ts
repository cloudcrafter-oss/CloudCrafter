import client from '@cloudcrafter/api/client'
import type { RenameTeamMutationRequest, RenameTeamMutationResponse, RenameTeamPathParams } from '../types/RenameTeam'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getRenameTeamUrl(teamId: RenameTeamPathParams['teamId']) {
  return `/api/Teams/${teamId}` as const
}

/**
 * {@link /api/Teams/:teamId}
 */
export async function renameTeam(
  teamId: RenameTeamPathParams['teamId'],
  data: RenameTeamMutationRequest,
  config: Partial<RequestConfig<RenameTeamMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<RenameTeamMutationResponse, ResponseErrorConfig<Error>, RenameTeamMutationRequest>({
    method: 'PUT',
    url: getRenameTeamUrl(teamId).toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}