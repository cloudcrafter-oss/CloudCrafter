import client from '@kubb/plugin-client/clients/axios'
import type {
  PostCreateEnvironmentVariableGroupMutationRequest,
  PostCreateEnvironmentVariableGroupMutationResponse,
  PostCreateEnvironmentVariableGroupPathParams,
} from '../types/PostCreateEnvironmentVariableGroup'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getPostCreateEnvironmentVariableGroupUrl(stackId: PostCreateEnvironmentVariableGroupPathParams['stackId']) {
  return `/api/Stacks/${stackId}/environment-variable-groups` as const
}

/**
 * {@link /api/Stacks/:stackId/environment-variable-groups}
 */
export async function postCreateEnvironmentVariableGroup(
  stackId: PostCreateEnvironmentVariableGroupPathParams['stackId'],
  data: PostCreateEnvironmentVariableGroupMutationRequest,
  config: Partial<RequestConfig<PostCreateEnvironmentVariableGroupMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PostCreateEnvironmentVariableGroupMutationResponse, ResponseErrorConfig<Error>, PostCreateEnvironmentVariableGroupMutationRequest>({
    method: 'POST',
    url: getPostCreateEnvironmentVariableGroupUrl(stackId).toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}