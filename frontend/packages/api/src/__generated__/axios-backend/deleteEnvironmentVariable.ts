import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type {
  DeleteEnvironmentVariableMutationResponse,
  DeleteEnvironmentVariablePathParams,
  DeleteEnvironmentVariable400,
} from '../types/DeleteEnvironmentVariable'

export function getDeleteEnvironmentVariableUrl(stackId: DeleteEnvironmentVariablePathParams['stackId'], id: DeleteEnvironmentVariablePathParams['id']) {
  return `/api/Stacks/${stackId}/environment-variables/${id}` as const
}

/**
 * {@link /api/Stacks/:stackId/environment-variables/:id}
 */
export async function deleteEnvironmentVariable(
  stackId: DeleteEnvironmentVariablePathParams['stackId'],
  id: DeleteEnvironmentVariablePathParams['id'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<DeleteEnvironmentVariableMutationResponse, ResponseErrorConfig<DeleteEnvironmentVariable400>, unknown>({
    method: 'DELETE',
    url: getDeleteEnvironmentVariableUrl(stackId, id).toString(),
    ...requestConfig,
  })
  return res.data
}