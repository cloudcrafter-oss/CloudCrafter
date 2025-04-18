import client from '@cloudcrafter/api/client'
import type { GetUsersMutationRequest, GetUsersMutationResponse } from '../types/GetUsers'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getGetUsersUrl() {
  return `/api/Users` as const
}

/**
 * {@link /api/Users}
 */
export async function getUsers(data: GetUsersMutationRequest, config: Partial<RequestConfig<GetUsersMutationRequest>> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetUsersMutationResponse, ResponseErrorConfig<Error>, GetUsersMutationRequest>({
    method: 'POST',
    url: getGetUsersUrl().toString(),
    data,
    ...requestConfig,
  })
  return res.data
}