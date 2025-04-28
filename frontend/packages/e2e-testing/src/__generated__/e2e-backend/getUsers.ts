import client from '@kubb/plugin-client/clients/axios'
import type { GetUsersQueryResponse, GetUsersQueryParams } from '../types/GetUsers'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getGetUsersUrl() {
  return `/api/Users` as const
}

/**
 * {@link /api/Users}
 */
export async function getUsers(params?: GetUsersQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetUsersQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetUsersUrl().toString(),
    params,
    ...requestConfig,
  })
  return res.data
}