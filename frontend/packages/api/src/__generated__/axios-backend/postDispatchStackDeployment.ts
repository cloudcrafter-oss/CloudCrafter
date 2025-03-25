import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { PostDispatchStackDeploymentMutationResponse, PostDispatchStackDeploymentPathParams } from '../types/PostDispatchStackDeployment'

export function getPostDispatchStackDeploymentUrl(id: PostDispatchStackDeploymentPathParams['id']) {
  return `/api/Stacks/${id}/deploy` as const
}

/**
 * {@link /api/Stacks/:id/deploy}
 */
export async function postDispatchStackDeployment(
  id: PostDispatchStackDeploymentPathParams['id'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PostDispatchStackDeploymentMutationResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'POST',
    url: getPostDispatchStackDeploymentUrl(id).toString(),
    ...requestConfig,
  })
  return res.data
}