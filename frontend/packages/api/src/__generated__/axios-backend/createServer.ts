import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { CreateServerMutationRequest, CreateServerMutationResponse } from '../types/CreateServer'

export function getCreateServerUrl() {
  return `/api/Servers` as const
}

/**
 * {@link /api/Servers}
 */
export async function createServer(
  data: CreateServerMutationRequest,
  config: Partial<RequestConfig<CreateServerMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<CreateServerMutationResponse, ResponseErrorConfig<Error>, CreateServerMutationRequest>({
    method: 'POST',
    url: getCreateServerUrl().toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}