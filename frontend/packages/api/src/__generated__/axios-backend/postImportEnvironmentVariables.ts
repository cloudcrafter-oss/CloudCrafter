import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type {
  PostImportEnvironmentVariablesMutationResponse,
  PostImportEnvironmentVariablesPathParams,
  PostImportEnvironmentVariables400,
} from '../types/PostImportEnvironmentVariables'

export function getPostImportEnvironmentVariablesUrl(stackId: PostImportEnvironmentVariablesPathParams['stackId']) {
  return `/api/Stacks/${stackId}/environment-variables/import` as const
}

/**
 * {@link /api/Stacks/:stackId/environment-variables/import}
 */
export async function postImportEnvironmentVariables(
  stackId: PostImportEnvironmentVariablesPathParams['stackId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PostImportEnvironmentVariablesMutationResponse, ResponseErrorConfig<PostImportEnvironmentVariables400>, unknown>({
    method: 'POST',
    url: getPostImportEnvironmentVariablesUrl(stackId).toString(),
    ...requestConfig,
  })
  return res.data
}