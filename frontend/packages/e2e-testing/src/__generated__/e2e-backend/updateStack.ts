import client from '@kubb/plugin-client/clients/axios'
import type { UpdateStackMutationRequest, UpdateStackMutationResponse, UpdateStackPathParams, UpdateStack404 } from '../types/UpdateStack'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getUpdateStackUrl(id: UpdateStackPathParams['id']) {
  return `/api/Stacks/${id}` as const
}

/**
 * {@link /api/Stacks/:id}
 */
export async function updateStack(
  id: UpdateStackPathParams['id'],
  data: UpdateStackMutationRequest,
  config: Partial<RequestConfig<UpdateStackMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<UpdateStackMutationResponse, ResponseErrorConfig<UpdateStack404>, UpdateStackMutationRequest>({
    method: 'PUT',
    url: getUpdateStackUrl(id).toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}