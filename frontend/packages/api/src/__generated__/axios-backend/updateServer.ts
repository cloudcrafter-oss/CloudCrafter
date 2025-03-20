import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { UpdateServerMutationRequest, UpdateServerMutationResponse, UpdateServerPathParams } from '../types/UpdateServer'

export function getUpdateServerUrl(id: UpdateServerPathParams['id']) {
  return `/api/Servers/${id}` as const
}

/**
 * {@link /api/Servers/:id}
 */
export async function updateServer(
  id: UpdateServerPathParams['id'],
  data?: UpdateServerMutationRequest,
  config: Partial<RequestConfig<UpdateServerMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<UpdateServerMutationResponse, ResponseErrorConfig<Error>, UpdateServerMutationRequest>({
    method: 'PATCH',
    url: getUpdateServerUrl(id).toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}