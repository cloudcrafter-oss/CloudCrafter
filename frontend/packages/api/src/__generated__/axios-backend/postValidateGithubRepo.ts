import client from '@cloudcrafter/client-auth/clients'
import type { PostValidateGithubRepoMutationRequest, PostValidateGithubRepoMutationResponse } from '../types/PostValidateGithubRepo'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/client-auth/clients'

export function getPostValidateGithubRepoUrl() {
  return `/api/Utils/validate-git-repository` as const
}

/**
 * {@link /api/Utils/validate-git-repository}
 */
export async function postValidateGithubRepo(
  data: PostValidateGithubRepoMutationRequest,
  config: Partial<RequestConfig<PostValidateGithubRepoMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PostValidateGithubRepoMutationResponse, ResponseErrorConfig<Error>, PostValidateGithubRepoMutationRequest>({
    method: 'POST',
    url: getPostValidateGithubRepoUrl().toString(),
    data,
    ...requestConfig,
  })
  return res.data
}