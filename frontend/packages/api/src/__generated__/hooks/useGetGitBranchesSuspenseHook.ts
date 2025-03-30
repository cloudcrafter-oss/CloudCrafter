import client from '@cloudcrafter/api/client'
import type { GetGitBranchesQueryResponse, GetGitBranchesPathParams } from '../types/GetGitBranches'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getGitBranches } from '../axios-backend/getGitBranches'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getGitBranchesSuspenseQueryKey = (id: GetGitBranchesPathParams['id'], repositoryId: GetGitBranchesPathParams['repositoryId']) =>
  [{ url: '/api/Providers/:id/branches/:repositoryId', params: { id: id, repositoryId: repositoryId } }] as const

export type GetGitBranchesSuspenseQueryKey = ReturnType<typeof getGitBranchesSuspenseQueryKey>

export function getGitBranchesSuspenseQueryOptionsHook(
  id: GetGitBranchesPathParams['id'],
  repositoryId: GetGitBranchesPathParams['repositoryId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getGitBranchesSuspenseQueryKey(id, repositoryId)
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
export function useGetGitBranchesSuspenseHook<
  TData = GetGitBranchesQueryResponse,
  TQueryData = GetGitBranchesQueryResponse,
  TQueryKey extends QueryKey = GetGitBranchesSuspenseQueryKey,
>(
  id: GetGitBranchesPathParams['id'],
  repositoryId: GetGitBranchesPathParams['repositoryId'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetGitBranchesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getGitBranchesSuspenseQueryKey(id, repositoryId)

  const query = useSuspenseQuery({
    ...(getGitBranchesSuspenseQueryOptionsHook(id, repositoryId, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}