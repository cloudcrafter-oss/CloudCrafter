import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type {
  GetDeploymentsForServerQueryResponse,
  GetDeploymentsForServerPathParams,
  GetDeploymentsForServerQueryParams,
} from '../types/GetDeploymentsForServer'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { getDeploymentsForServer } from '../axios-backend/getDeploymentsForServer'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getDeploymentsForServerInfiniteQueryKey = (id: GetDeploymentsForServerPathParams['id'], params?: GetDeploymentsForServerQueryParams) =>
  [{ url: '/api/Servers/:id/deployments', params: { id: id } }, ...(params ? [params] : [])] as const

export type GetDeploymentsForServerInfiniteQueryKey = ReturnType<typeof getDeploymentsForServerInfiniteQueryKey>

export function getDeploymentsForServerInfiniteQueryOptionsHook(
  id: GetDeploymentsForServerPathParams['id'],
  params?: GetDeploymentsForServerQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getDeploymentsForServerInfiniteQueryKey(id, params)
  return infiniteQueryOptions<GetDeploymentsForServerQueryResponse, ResponseErrorConfig<Error>, GetDeploymentsForServerQueryResponse, typeof queryKey, number>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal, pageParam }) => {
      config.signal = signal

      if (params) {
        params['id'] = pageParam as unknown as GetDeploymentsForServerQueryParams['id']
      }
      return getDeploymentsForServer(id, params, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /api/Servers/:id/deployments}
 */
export function useGetDeploymentsForServerInfiniteHook<
  TData = InfiniteData<GetDeploymentsForServerQueryResponse>,
  TQueryData = GetDeploymentsForServerQueryResponse,
  TQueryKey extends QueryKey = GetDeploymentsForServerInfiniteQueryKey,
>(
  id: GetDeploymentsForServerPathParams['id'],
  params?: GetDeploymentsForServerQueryParams,
  options: {
    query?: Partial<InfiniteQueryObserverOptions<GetDeploymentsForServerQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDeploymentsForServerInfiniteQueryKey(id, params)

  const query = useInfiniteQuery({
    ...(getDeploymentsForServerInfiniteQueryOptionsHook(id, params, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}