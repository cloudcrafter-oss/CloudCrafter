import client from '@cloudcrafter/api/client'
import type { DeleteTeamMutationResponse, DeleteTeamPathParams } from '../types/DeleteTeam'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getDeleteTeamUrl(teamId: DeleteTeamPathParams['teamId']) {
  return `/api/Teams/${teamId}` as const
}

/**
 * {@link /api/Teams/:teamId}
 */
export async function deleteTeam(teamId: DeleteTeamPathParams['teamId'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<DeleteTeamMutationResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'DELETE',
    url: getDeleteTeamUrl(teamId).toString(),
    ...requestConfig,
  })
  return res.data
}