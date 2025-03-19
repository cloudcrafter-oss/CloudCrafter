import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetServersQueryResponse } from '../types/GetServers'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getServers } from '../axios-backend/getServers'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getServersQueryKey = () => [{ url: '/api/Servers' }] as const

export type GetServersQueryKey = ReturnType<typeof getServersQueryKey>

export function getServersQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getServersQueryKey()
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
export function useGetServersHook<TData = GetServersQueryResponse, TQueryData = GetServersQueryResponse, TQueryKey extends QueryKey = GetServersQueryKey>(
  options: {
    query?: Partial<QueryObserverOptions<GetServersQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getServersQueryKey()

  const query = useQuery({
    ...(getServersQueryOptionsHook(config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}