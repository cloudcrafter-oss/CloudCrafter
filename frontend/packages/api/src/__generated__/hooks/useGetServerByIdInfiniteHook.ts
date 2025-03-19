import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetServerByIdQueryResponse, GetServerByIdPathParams } from '../types/GetServerById'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { getServerById } from '../axios-backend/getServerById'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getServerByIdInfiniteQueryKey = (id: GetServerByIdPathParams['id']) => [{ url: '/api/Servers/:id', params: { id: id } }] as const

export type GetServerByIdInfiniteQueryKey = ReturnType<typeof getServerByIdInfiniteQueryKey>

export function getServerByIdInfiniteQueryOptionsHook(id: GetServerByIdPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getServerByIdInfiniteQueryKey(id)
  return infiniteQueryOptions<GetServerByIdQueryResponse, ResponseErrorConfig<Error>, GetServerByIdQueryResponse, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getServerById(id, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /api/Servers/:id}
 */
export function useGetServerByIdInfiniteHook<
  TData = InfiniteData<GetServerByIdQueryResponse>,
  TQueryData = GetServerByIdQueryResponse,
  TQueryKey extends QueryKey = GetServerByIdInfiniteQueryKey,
>(
  id: GetServerByIdPathParams['id'],
  options: {
    query?: Partial<InfiniteQueryObserverOptions<GetServerByIdQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getServerByIdInfiniteQueryKey(id)

  const query = useInfiniteQuery({
    ...(getServerByIdInfiniteQueryOptionsHook(id, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}