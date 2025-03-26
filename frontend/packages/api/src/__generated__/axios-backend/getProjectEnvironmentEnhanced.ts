import client from '@cloudcrafter/api/client'
import type {
  GetProjectEnvironmentEnhancedQueryResponse,
  GetProjectEnvironmentEnhancedPathParams,
  GetProjectEnvironmentEnhanced404,
} from '../types/GetProjectEnvironmentEnhanced'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getGetProjectEnvironmentEnhancedUrl(
  id: GetProjectEnvironmentEnhancedPathParams['id'],
  environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
) {
  return `/api/Projects/${id}/${environmentId}` as const
}

/**
 * {@link /api/Projects/:id/:environmentId}
 */
export async function getProjectEnvironmentEnhanced(
  id: GetProjectEnvironmentEnhancedPathParams['id'],
  environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetProjectEnvironmentEnhancedQueryResponse, ResponseErrorConfig<GetProjectEnvironmentEnhanced404>, unknown>({
    method: 'GET',
    url: getGetProjectEnvironmentEnhancedUrl(id, environmentId).toString(),
    ...requestConfig,
  })
  return res.data
}