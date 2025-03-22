import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type {
  PostCreateEnvironmentVariableMutationRequest,
  PostCreateEnvironmentVariableMutationResponse,
  PostCreateEnvironmentVariablePathParams,
  PostCreateEnvironmentVariable400,
} from '../types/PostCreateEnvironmentVariable'

export function getPostCreateEnvironmentVariableUrl(stackId: PostCreateEnvironmentVariablePathParams['stackId']) {
  return `/api/Stacks/${stackId}/environment-variables` as const
}

/**
 * {@link /api/Stacks/:stackId/environment-variables}
 */
export async function postCreateEnvironmentVariable(
  stackId: PostCreateEnvironmentVariablePathParams['stackId'],
  data: PostCreateEnvironmentVariableMutationRequest,
  config: Partial<RequestConfig<PostCreateEnvironmentVariableMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<
    PostCreateEnvironmentVariableMutationResponse,
    ResponseErrorConfig<PostCreateEnvironmentVariable400>,
    PostCreateEnvironmentVariableMutationRequest
  >({
    method: 'POST',
    url: getPostCreateEnvironmentVariableUrl(stackId).toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}