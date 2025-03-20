import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { DeleteProjectMutationResponse, DeleteProjectPathParams } from '../types/DeleteProject'

export function getDeleteProjectUrl(id: DeleteProjectPathParams['id']) {
  return `/api/Projects/${id}` as const
}

/**
 * {@link /api/Projects/:id}
 */
export async function deleteProject(id: DeleteProjectPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<DeleteProjectMutationResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'DELETE',
    url: getDeleteProjectUrl(id).toString(),
    ...requestConfig,
  })
  return res.data
}