import client from '@kubb/plugin-client/clients/axios'
import type { GetGitBranchesQueryResponse, GetGitBranchesPathParams } from '../types/GetGitBranches'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getGetGitBranchesUrl(id: GetGitBranchesPathParams['id'], repositoryId: GetGitBranchesPathParams['repositoryId']) {
  return `/api/Providers/${id}/branches/${repositoryId}` as const
}

/**
 * {@link /api/Providers/:id/branches/:repositoryId}
 */
export async function getGitBranches(
  id: GetGitBranchesPathParams['id'],
  repositoryId: GetGitBranchesPathParams['repositoryId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetGitBranchesQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetGitBranchesUrl(id, repositoryId).toString(),
    ...requestConfig,
  })
  return res.data
}