import client from '@cloudcrafter/client-auth/clients'
import type { UpdateProjectMutationRequest, UpdateProjectMutationResponse, UpdateProjectPathParams } from '../types/UpdateProject'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/client-auth/clients'

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