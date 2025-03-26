import client from '@cloudcrafter/api/client'
import type { PostCreateStackMutationRequest, PostCreateStackMutationResponse } from '../types/PostCreateStack'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getPostCreateStackUrl() {
  return `/api/Stacks` as const
}

/**
 * {@link /api/Stacks}
 */
export async function postCreateStack(
  data: PostCreateStackMutationRequest,
  config: Partial<RequestConfig<PostCreateStackMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PostCreateStackMutationResponse, ResponseErrorConfig<Error>, PostCreateStackMutationRequest>({
    method: 'POST',
    url: getPostCreateStackUrl().toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}