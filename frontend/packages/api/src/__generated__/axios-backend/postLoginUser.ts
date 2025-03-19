import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { PostLoginUserMutationRequest, PostLoginUserMutationResponse } from '../types/PostLoginUser'

export function getPostLoginUserUrl() {
  return `/api/Auth/login` as const
}

/**
 * {@link /api/Auth/login}
 */
export async function postLoginUser(
  data: PostLoginUserMutationRequest,
  config: Partial<RequestConfig<PostLoginUserMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PostLoginUserMutationResponse, ResponseErrorConfig<Error>, PostLoginUserMutationRequest>({
    method: 'POST',
    url: getPostLoginUserUrl().toString(),
    data,
    ...requestConfig,
  })
  return res.data
}