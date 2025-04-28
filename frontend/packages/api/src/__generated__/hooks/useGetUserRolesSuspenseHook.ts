import client from '@cloudcrafter/api/client'
import type { GetUserRolesQueryResponse } from '../types/GetUserRoles'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getUserRoles } from '../axios-backend/getUserRoles'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getUserRolesSuspenseQueryKey = () => [{ url: '/api/Users/current-user/roles' }] as const

export type GetUserRolesSuspenseQueryKey = ReturnType<typeof getUserRolesSuspenseQueryKey>

export function getUserRolesSuspenseQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getUserRolesSuspenseQueryKey()
  return queryOptions<GetUserRolesQueryResponse, ResponseErrorConfig<Error>, GetUserRolesQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getUserRoles(config)
    },
  })
}

/**
 * {@link /api/Users/current-user/roles}
 */
export function useGetUserRolesSuspenseHook<
  TData = GetUserRolesQueryResponse,
  TQueryData = GetUserRolesQueryResponse,
  TQueryKey extends QueryKey = GetUserRolesSuspenseQueryKey,
>(
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetUserRolesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getUserRolesSuspenseQueryKey()

  const query = useSuspenseQuery({
    ...(getUserRolesSuspenseQueryOptionsHook(config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}