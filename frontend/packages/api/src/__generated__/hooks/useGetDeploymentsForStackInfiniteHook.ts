import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetDeploymentsForStackQueryResponse, GetDeploymentsForStackPathParams } from '../types/GetDeploymentsForStack'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { getDeploymentsForStack } from '../axios-backend/getDeploymentsForStack'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getDeploymentsForStackInfiniteQueryKey = (id: GetDeploymentsForStackPathParams['id']) =>
  [{ url: '/api/Stacks/:id/deployments', params: { id: id } }] as const

export type GetDeploymentsForStackInfiniteQueryKey = ReturnType<typeof getDeploymentsForStackInfiniteQueryKey>

export function getDeploymentsForStackInfiniteQueryOptionsHook(
  id: GetDeploymentsForStackPathParams['id'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getDeploymentsForStackInfiniteQueryKey(id)
  return infiniteQueryOptions<GetDeploymentsForStackQueryResponse, ResponseErrorConfig<Error>, GetDeploymentsForStackQueryResponse, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getDeploymentsForStack(id, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /api/Stacks/:id/deployments}
 */
export function useGetDeploymentsForStackInfiniteHook<
  TData = InfiniteData<GetDeploymentsForStackQueryResponse>,
  TQueryData = GetDeploymentsForStackQueryResponse,
  TQueryKey extends QueryKey = GetDeploymentsForStackInfiniteQueryKey,
>(
  id: GetDeploymentsForStackPathParams['id'],
  options: {
    query?: Partial<InfiniteQueryObserverOptions<GetDeploymentsForStackQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDeploymentsForStackInfiniteQueryKey(id)

  const query = useInfiniteQuery({
    ...(getDeploymentsForStackInfiniteQueryOptionsHook(id, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}