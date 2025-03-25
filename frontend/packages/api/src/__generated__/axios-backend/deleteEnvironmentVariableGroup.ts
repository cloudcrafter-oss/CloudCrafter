import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { DeleteEnvironmentVariableGroupMutationResponse, DeleteEnvironmentVariableGroupPathParams } from '../types/DeleteEnvironmentVariableGroup'

export function getDeleteEnvironmentVariableGroupUrl(
  stackId: DeleteEnvironmentVariableGroupPathParams['stackId'],
  id: DeleteEnvironmentVariableGroupPathParams['id'],
) {
  return `/api/Stacks/${stackId}/environment-variable-groups/${id}` as const
}

/**
 * {@link /api/Stacks/:stackId/environment-variable-groups/:id}
 */
export async function deleteEnvironmentVariableGroup(
  stackId: DeleteEnvironmentVariableGroupPathParams['stackId'],
  id: DeleteEnvironmentVariableGroupPathParams['id'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<DeleteEnvironmentVariableGroupMutationResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'DELETE',
    url: getDeleteEnvironmentVariableGroupUrl(stackId, id).toString(),
    ...requestConfig,
  })
  return res.data
}