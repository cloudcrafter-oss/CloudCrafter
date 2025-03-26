import client from '@cloudcrafter/api/client'
import type { GetGitBranchesQueryResponse, GetGitBranchesPathParams } from '../types/GetGitBranches'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getGitBranches } from '../axios-backend/getGitBranches'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getGitBranchesQueryKey = (id: GetGitBranchesPathParams['id'], repositoryId: GetGitBranchesPathParams['repositoryId']) =>
  [{ url: '/api/Providers/:id/branches/:repositoryId', params: { id: id, repositoryId: repositoryId } }] as const

export type GetGitBranchesQueryKey = ReturnType<typeof getGitBranchesQueryKey>

export function getGitBranchesQueryOptionsHook(
  id: GetGitBranchesPathParams['id'],
  repositoryId: GetGitBranchesPathParams['repositoryId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getGitBranchesQueryKey(id, repositoryId)
  return queryOptions<GetGitBranchesQueryResponse, ResponseErrorConfig<Error>, GetGitBranchesQueryResponse, typeof queryKey>({
    enabled: !!(id && repositoryId),
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getGitBranches(id, repositoryId, config)
    },
  })
}

/**
 * {@link /api/Providers/:id/branches/:repositoryId}
 */
export function useGetGitBranchesHook<
  TData = GetGitBranchesQueryResponse,
  TQueryData = GetGitBranchesQueryResponse,
  TQueryKey extends QueryKey = GetGitBranchesQueryKey,
>(
  id: GetGitBranchesPathParams['id'],
  repositoryId: GetGitBranchesPathParams['repositoryId'],
  options: {
    query?: Partial<QueryObserverOptions<GetGitBranchesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getGitBranchesQueryKey(id, repositoryId)

  const query = useQuery({
    ...(getGitBranchesQueryOptionsHook(id, repositoryId, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}