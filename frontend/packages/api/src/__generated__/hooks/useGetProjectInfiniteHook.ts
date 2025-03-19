import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetProjectQueryResponse, GetProjectPathParams, GetProject404 } from '../types/GetProject'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { getProject } from '../axios-backend/getProject'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getProjectInfiniteQueryKey = (id: GetProjectPathParams['id']) => [{ url: '/api/Projects/:id', params: { id: id } }] as const

export type GetProjectInfiniteQueryKey = ReturnType<typeof getProjectInfiniteQueryKey>

export function getProjectInfiniteQueryOptionsHook(id: GetProjectPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getProjectInfiniteQueryKey(id)
  return infiniteQueryOptions<GetProjectQueryResponse, ResponseErrorConfig<GetProject404>, GetProjectQueryResponse, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getProject(id, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /api/Projects/:id}
 */
export function useGetProjectInfiniteHook<
  TData = InfiniteData<GetProjectQueryResponse>,
  TQueryData = GetProjectQueryResponse,
  TQueryKey extends QueryKey = GetProjectInfiniteQueryKey,
>(
  id: GetProjectPathParams['id'],
  options: {
    query?: Partial<InfiniteQueryObserverOptions<GetProjectQueryResponse, ResponseErrorConfig<GetProject404>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getProjectInfiniteQueryKey(id)

  const query = useInfiniteQuery({
    ...(getProjectInfiniteQueryOptionsHook(id, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<GetProject404>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}