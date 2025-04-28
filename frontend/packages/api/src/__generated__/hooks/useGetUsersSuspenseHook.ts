import client from '@cloudcrafter/api/client'
import type { GetUsersQueryResponse, GetUsersQueryParams } from '../types/GetUsers'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getUsers } from '../axios-backend/getUsers'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getUsersSuspenseQueryKey = (params?: GetUsersQueryParams) => [{ url: '/api/Users' }, ...(params ? [params] : [])] as const

export type GetUsersSuspenseQueryKey = ReturnType<typeof getUsersSuspenseQueryKey>

export function getUsersSuspenseQueryOptionsHook(params?: GetUsersQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getUsersSuspenseQueryKey(params)
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
export function useGetUsersSuspenseHook<
  TData = GetUsersQueryResponse,
  TQueryData = GetUsersQueryResponse,
  TQueryKey extends QueryKey = GetUsersSuspenseQueryKey,
>(
  params?: GetUsersQueryParams,
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetUsersQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getUsersSuspenseQueryKey(params)

  const query = useSuspenseQuery({
    ...(getUsersSuspenseQueryOptionsHook(params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}