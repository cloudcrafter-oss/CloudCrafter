import client from '@cloudcrafter/api/client'
import type { CreateProjectMutationRequest, CreateProjectMutationResponse } from '../types/CreateProject'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getCreateProjectUrl() {
  return `/api/Projects` as const
}

/**
 * {@link /api/Projects}
 */
export async function createProject(
  data: CreateProjectMutationRequest,
  config: Partial<RequestConfig<CreateProjectMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<CreateProjectMutationResponse, ResponseErrorConfig<Error>, CreateProjectMutationRequest>({
    method: 'POST',
    url: getCreateProjectUrl().toString(),
    data,
    ...requestConfig,
  })
  return res.data
}