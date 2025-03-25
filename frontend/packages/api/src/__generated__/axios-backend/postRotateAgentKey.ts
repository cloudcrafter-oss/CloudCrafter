import client from '@kubb/plugin-client/clients/axios'
import type { PostRotateAgentKeyMutationResponse, PostRotateAgentKeyPathParams } from '../types/PostRotateAgentKey'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getPostRotateAgentKeyUrl(id: PostRotateAgentKeyPathParams['id']) {
  return `/api/Servers/${id}/rotate-key` as const
}

/**
 * {@link /api/Servers/:id/rotate-key}
 */
export async function postRotateAgentKey(id: PostRotateAgentKeyPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PostRotateAgentKeyMutationResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'POST',
    url: getPostRotateAgentKeyUrl(id).toString(),
    ...requestConfig,
  })
  return res.data
}