import client from '@cloudcrafter/api/client'
import type { GetUsersQueryResponse, GetUsersQueryParams } from '../types/GetUsers'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getUsers } from '../axios-backend/getUsers'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getUsersQueryKey = (params?: GetUsersQueryParams) => [{ url: '/api/Users' }, ...(params ? [params] : [])] as const

export type GetUsersQueryKey = ReturnType<typeof getUsersQueryKey>

export function getUsersQueryOptionsHook(params?: GetUsersQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getUsersQueryKey(params)
  return queryOptions<GetUsersQueryResponse, ResponseErrorConfig<Error>, GetUsersQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getUsers(params, config)
    },
  })
}

/**
 * {@link /api/Users}
 */
export function useGetUsersHook<TData = GetUsersQueryResponse, TQueryData = GetUsersQueryResponse, TQueryKey extends QueryKey = GetUsersQueryKey>(
  params?: GetUsersQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<GetUsersQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getUsersQueryKey(params)

  const query = useQuery({
    ...(getUsersQueryOptionsHook(params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}