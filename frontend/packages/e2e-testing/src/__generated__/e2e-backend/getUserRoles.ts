import client from '@kubb/plugin-client/clients/axios'
import type { GetUserRolesQueryResponse } from '../types/GetUserRoles'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getGetUserRolesUrl() {
  return `/api/Users/current-user/roles` as const
}

/**
 * {@link /api/Users/current-user/roles}
 */
export async function getUserRoles(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetUserRolesQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetUserRolesUrl().toString(),
    ...requestConfig,
  })
  return res.data
}