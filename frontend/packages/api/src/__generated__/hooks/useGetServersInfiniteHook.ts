import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetServersQueryResponse } from '../types/GetServers'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { getServers } from '../axios-backend/getServers'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getServersInfiniteQueryKey = () => [{ url: '/api/Servers' }] as const

export type GetServersInfiniteQueryKey = ReturnType<typeof getServersInfiniteQueryKey>

export function getServersInfiniteQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getServersInfiniteQueryKey()
  return infiniteQueryOptions<GetServersQueryResponse, ResponseErrorConfig<Error>, GetServersQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getServers(config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /api/Servers}
 */
export function useGetServersInfiniteHook<
  TData = InfiniteData<GetServersQueryResponse>,
  TQueryData = GetServersQueryResponse,
  TQueryKey extends QueryKey = GetServersInfiniteQueryKey,
>(
  options: {
    query?: Partial<InfiniteQueryObserverOptions<GetServersQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getServersInfiniteQueryKey()

  const query = useInfiniteQuery({
    ...(getServersInfiniteQueryOptionsHook(config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}