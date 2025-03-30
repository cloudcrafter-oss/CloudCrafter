import client from '@kubb/plugin-client/clients/axios'
import type { PostRefreshTokensMutationRequest, PostRefreshTokensMutationResponse } from '../types/PostRefreshTokens'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getPostRefreshTokensUrl() {
  return `/api/Auth/refresh` as const
}

/**
 * {@link /api/Auth/refresh}
 */
export async function postRefreshTokens(
  data: PostRefreshTokensMutationRequest,
  config: Partial<RequestConfig<PostRefreshTokensMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PostRefreshTokensMutationResponse, ResponseErrorConfig<Error>, PostRefreshTokensMutationRequest>({
    method: 'POST',
    url: getPostRefreshTokensUrl().toString(),
    data,
    ...requestConfig,
  })
  return res.data
}