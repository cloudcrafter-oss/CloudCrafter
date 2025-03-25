import client from '@cloudcrafter/client-auth/clients'
import type { PostLoginUserMutationRequest, PostLoginUserMutationResponse } from '../types/CloudCrafterAuthController/PostLoginUser'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/client-auth/clients'

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