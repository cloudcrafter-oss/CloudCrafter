import client from '@cloudcrafter/client-auth/clients'
import type { GetGitRepositoriesQueryResponse, GetGitRepositoriesPathParams } from '../types/GetGitRepositories'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/client-auth/clients'

export function getGetGitRepositoriesUrl(id: GetGitRepositoriesPathParams['id']) {
  return `/api/Providers/${id}/repositories` as const
}

/**
 * {@link /api/Providers/:id/repositories}
 */
export async function getGitRepositories(id: GetGitRepositoriesPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetGitRepositoriesQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetGitRepositoriesUrl(id).toString(),
    ...requestConfig,
  })
  return res.data
}