import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { PostCreateStackMutationRequest, PostCreateStackMutationResponse } from '../types/PostCreateStack'

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
  })
  return res.data
}