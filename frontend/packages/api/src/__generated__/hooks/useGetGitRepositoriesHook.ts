import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetGitRepositoriesQueryResponse, GetGitRepositoriesPathParams } from '../types/GetGitRepositories'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getGitRepositories } from '../axios-backend/getGitRepositories'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getGitRepositoriesQueryKey = (id: GetGitRepositoriesPathParams['id']) => [{ url: '/api/Providers/:id/repositories', params: { id: id } }] as const

export type GetGitRepositoriesQueryKey = ReturnType<typeof getGitRepositoriesQueryKey>

export function getGitRepositoriesQueryOptionsHook(id: GetGitRepositoriesPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getGitRepositoriesQueryKey(id)
  return queryOptions<GetGitRepositoriesQueryResponse, ResponseErrorConfig<Error>, GetGitRepositoriesQueryResponse, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getGitRepositories(id, config)
    },
  })
}

/**
 * {@link /api/Providers/:id/repositories}
 */
export function useGetGitRepositoriesHook<
  TData = GetGitRepositoriesQueryResponse,
  TQueryData = GetGitRepositoriesQueryResponse,
  TQueryKey extends QueryKey = GetGitRepositoriesQueryKey,
>(
  id: GetGitRepositoriesPathParams['id'],
  options: {
    query?: Partial<QueryObserverOptions<GetGitRepositoriesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getGitRepositoriesQueryKey(id)

  const query = useQuery({
    ...(getGitRepositoriesQueryOptionsHook(id, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}