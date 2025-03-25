import client from '@kubb/plugin-client/clients/axios'
import type { DeleteProviderMutationResponse, DeleteProviderPathParams } from '../types/DeleteProvider'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

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