import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetGitRepositoriesQueryResponse, GetGitRepositoriesPathParams } from '../types/GetGitRepositories'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { getGitRepositories } from '../axios-backend/getGitRepositories'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getGitRepositoriesInfiniteQueryKey = (id: GetGitRepositoriesPathParams['id']) =>
  [{ url: '/api/Providers/:id/repositories', params: { id: id } }] as const

export type GetGitRepositoriesInfiniteQueryKey = ReturnType<typeof getGitRepositoriesInfiniteQueryKey>

export function getGitRepositoriesInfiniteQueryOptionsHook(
  id: GetGitRepositoriesPathParams['id'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getGitRepositoriesInfiniteQueryKey(id)
  return infiniteQueryOptions<GetGitRepositoriesQueryResponse, ResponseErrorConfig<Error>, GetGitRepositoriesQueryResponse, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getGitRepositories(id, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /api/Providers/:id/repositories}
 */
export function useGetGitRepositoriesInfiniteHook<
  TData = InfiniteData<GetGitRepositoriesQueryResponse>,
  TQueryData = GetGitRepositoriesQueryResponse,
  TQueryKey extends QueryKey = GetGitRepositoriesInfiniteQueryKey,
>(
  id: GetGitRepositoriesPathParams['id'],
  options: {
    query?: Partial<InfiniteQueryObserverOptions<GetGitRepositoriesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getGitRepositoriesInfiniteQueryKey(id)

  const query = useInfiniteQuery({
    ...(getGitRepositoriesInfiniteQueryOptionsHook(id, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}