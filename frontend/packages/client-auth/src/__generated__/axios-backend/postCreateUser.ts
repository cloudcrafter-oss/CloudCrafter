import client from '@cloudcrafter/client-auth/clients'
import type { PostCreateUserMutationRequest, PostCreateUserMutationResponse } from '../types/CloudCrafterAuthController/PostCreateUser'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/client-auth/clients'

export function getPostCreateUserUrl() {
  return `/api/Auth/create` as const
}

/**
 * {@link /api/Auth/create}
 */
export async function postCreateUser(
  data: PostCreateUserMutationRequest,
  config: Partial<RequestConfig<PostCreateUserMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PostCreateUserMutationResponse, ResponseErrorConfig<Error>, PostCreateUserMutationRequest>({
    method: 'POST',
    url: getPostCreateUserUrl().toString(),
    data,
    ...requestConfig,
  })
  return res.data
}