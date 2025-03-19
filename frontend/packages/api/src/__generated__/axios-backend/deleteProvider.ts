import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { DeleteProviderMutationResponse, DeleteProviderPathParams } from '../types/DeleteProvider'

export function getDeleteProviderUrl(id: DeleteProviderPathParams['id']) {
  return `/api/Providers/${id}` as const
}

/**
 * {@link /api/Providers/:id}
 */
export async function deleteProvider(id: DeleteProviderPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<DeleteProviderMutationResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'DELETE',
    url: getDeleteProviderUrl(id).toString(),
    ...requestConfig,
  })
  return res.data
}