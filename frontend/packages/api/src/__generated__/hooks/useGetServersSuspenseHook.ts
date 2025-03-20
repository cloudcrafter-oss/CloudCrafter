import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetServersQueryResponse } from '../types/GetServers'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getServers } from '../axios-backend/getServers'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getServersSuspenseQueryKey = () => [{ url: '/api/Servers' }] as const

export type GetServersSuspenseQueryKey = ReturnType<typeof getServersSuspenseQueryKey>

export function getServersSuspenseQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getServersSuspenseQueryKey()
  return queryOptions<GetServersQueryResponse, ResponseErrorConfig<Error>, GetServersQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getServers(config)
    },
  })
}

/**
 * {@link /api/Servers}
 */
export function useGetServersSuspenseHook<
  TData = GetServersQueryResponse,
  TQueryData = GetServersQueryResponse,
  TQueryKey extends QueryKey = GetServersSuspenseQueryKey,
>(
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetServersQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getServersSuspenseQueryKey()

  const query = useSuspenseQuery({
    ...(getServersSuspenseQueryOptionsHook(config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}