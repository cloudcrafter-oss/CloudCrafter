import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { UpdateProjectMutationRequest, UpdateProjectMutationResponse, UpdateProjectPathParams } from '../types/UpdateProject'

export function getUpdateProjectUrl(id: UpdateProjectPathParams['id']) {
  return `/api/Projects/${id}` as const
}

/**
 * {@link /api/Projects/:id}
 */
export async function updateProject(
  id: UpdateProjectPathParams['id'],
  data?: UpdateProjectMutationRequest,
  config: Partial<RequestConfig<UpdateProjectMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<UpdateProjectMutationResponse, ResponseErrorConfig<Error>, UpdateProjectMutationRequest>({
    method: 'POST',
    url: getUpdateProjectUrl(id).toString(),
    data,
    ...requestConfig,
  })
  return res.data
}