import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetGitBranchesQueryResponse, GetGitBranchesPathParams } from '../types/GetGitBranches'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { getGitBranches } from '../axios-backend/getGitBranches'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getGitBranchesInfiniteQueryKey = (id: GetGitBranchesPathParams['id'], repositoryId: GetGitBranchesPathParams['repositoryId']) =>
  [{ url: '/api/Providers/:id/branches/:repositoryId', params: { id: id, repositoryId: repositoryId } }] as const

export type GetGitBranchesInfiniteQueryKey = ReturnType<typeof getGitBranchesInfiniteQueryKey>

export function getGitBranchesInfiniteQueryOptionsHook(
  id: GetGitBranchesPathParams['id'],
  repositoryId: GetGitBranchesPathParams['repositoryId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getGitBranchesInfiniteQueryKey(id, repositoryId)
  return infiniteQueryOptions<GetGitBranchesQueryResponse, ResponseErrorConfig<Error>, GetGitBranchesQueryResponse, typeof queryKey>({
    enabled: !!(id && repositoryId),
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getGitBranches(id, repositoryId, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /api/Providers/:id/branches/:repositoryId}
 */
export function useGetGitBranchesInfiniteHook<
  TData = InfiniteData<GetGitBranchesQueryResponse>,
  TQueryData = GetGitBranchesQueryResponse,
  TQueryKey extends QueryKey = GetGitBranchesInfiniteQueryKey,
>(
  id: GetGitBranchesPathParams['id'],
  repositoryId: GetGitBranchesPathParams['repositoryId'],
  options: {
    query?: Partial<InfiniteQueryObserverOptions<GetGitBranchesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getGitBranchesInfiniteQueryKey(id, repositoryId)

  const query = useInfiniteQuery({
    ...(getGitBranchesInfiniteQueryOptionsHook(id, repositoryId, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}