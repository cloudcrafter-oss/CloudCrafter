import client from '@cloudcrafter/api/client'
import type {
  PutUpdateEnvironmentVariableGroupMutationRequest,
  PutUpdateEnvironmentVariableGroupMutationResponse,
  PutUpdateEnvironmentVariableGroupPathParams,
  PutUpdateEnvironmentVariableGroup400,
} from '../types/PutUpdateEnvironmentVariableGroup'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getPutUpdateEnvironmentVariableGroupUrl(
  stackId: PutUpdateEnvironmentVariableGroupPathParams['stackId'],
  id: PutUpdateEnvironmentVariableGroupPathParams['id'],
) {
  return `/api/Stacks/${stackId}/environment-variable-groups/${id}` as const
}

/**
 * {@link /api/Stacks/:stackId/environment-variable-groups/:id}
 */
export async function putUpdateEnvironmentVariableGroup(
  stackId: PutUpdateEnvironmentVariableGroupPathParams['stackId'],
  id: PutUpdateEnvironmentVariableGroupPathParams['id'],
  data: PutUpdateEnvironmentVariableGroupMutationRequest,
  config: Partial<RequestConfig<PutUpdateEnvironmentVariableGroupMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<
    PutUpdateEnvironmentVariableGroupMutationResponse,
    ResponseErrorConfig<PutUpdateEnvironmentVariableGroup400>,
    PutUpdateEnvironmentVariableGroupMutationRequest
  >({
    method: 'PUT',
    url: getPutUpdateEnvironmentVariableGroupUrl(stackId, id).toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}