import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { PostCreateGithubAppMutationRequest, PostCreateGithubAppMutationResponse, PostCreateGithubApp400 } from '../types/PostCreateGithubApp'

export function getPostCreateGithubAppUrl() {
  return `/api/Providers` as const
}

/**
 * {@link /api/Providers}
 */
export async function postCreateGithubApp(
  data: PostCreateGithubAppMutationRequest,
  config: Partial<RequestConfig<PostCreateGithubAppMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PostCreateGithubAppMutationResponse, ResponseErrorConfig<PostCreateGithubApp400>, PostCreateGithubAppMutationRequest>({
    method: 'POST',
    url: getPostCreateGithubAppUrl().toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}