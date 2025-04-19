import client from '@cloudcrafter/api/client'
import type { CreateTeamMutationRequest, CreateTeamMutationResponse } from '../types/CreateTeam'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getCreateTeamUrl() {
  return `/api/Teams` as const
}

/**
 * {@link /api/Teams}
 */
export async function createTeam(data: CreateTeamMutationRequest, config: Partial<RequestConfig<CreateTeamMutationRequest>> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<CreateTeamMutationResponse, ResponseErrorConfig<Error>, CreateTeamMutationRequest>({
    method: 'POST',
    url: getCreateTeamUrl().toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}