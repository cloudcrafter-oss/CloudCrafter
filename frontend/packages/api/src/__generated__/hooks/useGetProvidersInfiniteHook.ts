import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetProvidersQueryResponse, GetProvidersQueryParams } from '../types/GetProviders'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { getProviders } from '../axios-backend/getProviders'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getProvidersInfiniteQueryKey = (params?: GetProvidersQueryParams) => [{ url: '/api/Providers' }, ...(params ? [params] : [])] as const

export type GetProvidersInfiniteQueryKey = ReturnType<typeof getProvidersInfiniteQueryKey>

export function getProvidersInfiniteQueryOptionsHook(params?: GetProvidersQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getProvidersInfiniteQueryKey(params)
  return infiniteQueryOptions<GetProvidersQueryResponse, ResponseErrorConfig<Error>, GetProvidersQueryResponse, typeof queryKey, number>({
    queryKey,
    queryFn: async ({ signal, pageParam }) => {
      config.signal = signal

      if (params) {
        params['id'] = pageParam as unknown as GetProvidersQueryParams['id']
      }
      return getProviders(params, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /api/Providers}
 */
export function useGetProvidersInfiniteHook<
  TData = InfiniteData<GetProvidersQueryResponse>,
  TQueryData = GetProvidersQueryResponse,
  TQueryKey extends QueryKey = GetProvidersInfiniteQueryKey,
>(
  params?: GetProvidersQueryParams,
  options: {
    query?: Partial<InfiniteQueryObserverOptions<GetProvidersQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getProvidersInfiniteQueryKey(params)

  const query = useInfiniteQuery({
    ...(getProvidersInfiniteQueryOptionsHook(params, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}