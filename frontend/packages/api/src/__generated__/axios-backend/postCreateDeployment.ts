import client from '@kubb/plugin-client/clients/axios'
import type { PostCreateDeploymentMutationResponse, PostCreateDeploymentPathParams } from '../types/PostCreateDeployment'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getPostCreateDeploymentUrl(applicationId: PostCreateDeploymentPathParams['applicationId']) {
  return `/api/Applications/${applicationId}/deployment` as const
}

/**
 * {@link /api/Applications/:applicationId/deployment}
 */
export async function postCreateDeployment(
  applicationId: PostCreateDeploymentPathParams['applicationId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PostCreateDeploymentMutationResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'POST',
    url: getPostCreateDeploymentUrl(applicationId).toString(),
    ...requestConfig,
  })
  return res.data
}