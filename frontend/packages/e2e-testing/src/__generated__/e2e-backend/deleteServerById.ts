import client from '@kubb/plugin-client/clients/axios'
import type { DeleteServerByIdMutationResponse, DeleteServerByIdPathParams } from '../types/DeleteServerById'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getDeleteServerByIdUrl(id: DeleteServerByIdPathParams['id']) {
  return `/api/Servers/${id}` as const
}

/**
 * {@link /api/Servers/:id}
 */
export async function deleteServerById(id: DeleteServerByIdPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<DeleteServerByIdMutationResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'DELETE',
    url: getDeleteServerByIdUrl(id).toString(),
    ...requestConfig,
  })
  return res.data
}