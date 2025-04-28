import client from '@cloudcrafter/api/client'
import type { GetUserRolesQueryResponse } from '../types/GetUserRoles'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getUserRoles } from '../axios-backend/getUserRoles'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getUserRolesQueryKey = () => [{ url: '/api/Users/current-user/roles' }] as const

export type GetUserRolesQueryKey = ReturnType<typeof getUserRolesQueryKey>

export function getUserRolesQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getUserRolesQueryKey()
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
export function useGetUserRolesHook<
  TData = GetUserRolesQueryResponse,
  TQueryData = GetUserRolesQueryResponse,
  TQueryKey extends QueryKey = GetUserRolesQueryKey,
>(
  options: {
    query?: Partial<QueryObserverOptions<GetUserRolesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getUserRolesQueryKey()

  const query = useQuery({
    ...(getUserRolesQueryOptionsHook(config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}