import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetStackDetailQueryResponse, GetStackDetailPathParams, GetStackDetail404 } from '../types/GetStackDetail'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { getStackDetail } from '../axios-backend/getStackDetail'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getStackDetailInfiniteQueryKey = (id: GetStackDetailPathParams['id']) => [{ url: '/api/Stacks/:id', params: { id: id } }] as const

export type GetStackDetailInfiniteQueryKey = ReturnType<typeof getStackDetailInfiniteQueryKey>

export function getStackDetailInfiniteQueryOptionsHook(id: GetStackDetailPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getStackDetailInfiniteQueryKey(id)
  return infiniteQueryOptions<GetStackDetailQueryResponse, ResponseErrorConfig<GetStackDetail404>, GetStackDetailQueryResponse, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getStackDetail(id, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /api/Stacks/:id}
 */
export function useGetStackDetailInfiniteHook<
  TData = InfiniteData<GetStackDetailQueryResponse>,
  TQueryData = GetStackDetailQueryResponse,
  TQueryKey extends QueryKey = GetStackDetailInfiniteQueryKey,
>(
  id: GetStackDetailPathParams['id'],
  options: {
    query?: Partial<InfiniteQueryObserverOptions<GetStackDetailQueryResponse, ResponseErrorConfig<GetStackDetail404>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getStackDetailInfiniteQueryKey(id)

  const query = useInfiniteQuery({
    ...(getStackDetailInfiniteQueryOptionsHook(id, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<GetStackDetail404>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}