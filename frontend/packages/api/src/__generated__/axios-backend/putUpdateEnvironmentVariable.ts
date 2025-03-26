import client from '@cloudcrafter/client-auth/clients'
import type {
  PutUpdateEnvironmentVariableMutationRequest,
  PutUpdateEnvironmentVariableMutationResponse,
  PutUpdateEnvironmentVariablePathParams,
  PutUpdateEnvironmentVariable400,
} from '../types/PutUpdateEnvironmentVariable'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/client-auth/clients'

export function getPutUpdateEnvironmentVariableUrl(
  stackId: PutUpdateEnvironmentVariablePathParams['stackId'],
  id: PutUpdateEnvironmentVariablePathParams['id'],
) {
  return `/api/Stacks/${stackId}/environment-variables/${id}` as const
}

/**
 * {@link /api/Stacks/:stackId/environment-variables/:id}
 */
export async function putUpdateEnvironmentVariable(
  stackId: PutUpdateEnvironmentVariablePathParams['stackId'],
  id: PutUpdateEnvironmentVariablePathParams['id'],
  data: PutUpdateEnvironmentVariableMutationRequest,
  config: Partial<RequestConfig<PutUpdateEnvironmentVariableMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<
    PutUpdateEnvironmentVariableMutationResponse,
    ResponseErrorConfig<PutUpdateEnvironmentVariable400>,
    PutUpdateEnvironmentVariableMutationRequest
  >({
    method: 'PUT',
    url: getPutUpdateEnvironmentVariableUrl(stackId, id).toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}