import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetProjectsQueryResponse, GetProjectsQueryParams } from '../types/GetProjects'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { getProjects } from '../axios-backend/getProjects'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getProjectsInfiniteQueryKey = (params?: GetProjectsQueryParams) => [{ url: '/api/Projects' }, ...(params ? [params] : [])] as const

export type GetProjectsInfiniteQueryKey = ReturnType<typeof getProjectsInfiniteQueryKey>

export function getProjectsInfiniteQueryOptionsHook(params?: GetProjectsQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getProjectsInfiniteQueryKey(params)
  return infiniteQueryOptions<GetProjectsQueryResponse, ResponseErrorConfig<Error>, GetProjectsQueryResponse, typeof queryKey, number>({
    queryKey,
    queryFn: async ({ signal, pageParam }) => {
      config.signal = signal

      if (params) {
        params['id'] = pageParam as unknown as GetProjectsQueryParams['id']
      }
      return getProjects(params, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /api/Projects}
 */
export function useGetProjectsInfiniteHook<
  TData = InfiniteData<GetProjectsQueryResponse>,
  TQueryData = GetProjectsQueryResponse,
  TQueryKey extends QueryKey = GetProjectsInfiniteQueryKey,
>(
  params?: GetProjectsQueryParams,
  options: {
    query?: Partial<InfiniteQueryObserverOptions<GetProjectsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getProjectsInfiniteQueryKey(params)

  const query = useInfiniteQuery({
    ...(getProjectsInfiniteQueryOptionsHook(params, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}