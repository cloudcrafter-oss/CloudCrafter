import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetGitRepositoriesQueryResponse, GetGitRepositoriesPathParams } from '../types/GetGitRepositories'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getGitRepositories } from '../axios-backend/getGitRepositories'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getGitRepositoriesSuspenseQueryKey = (id: GetGitRepositoriesPathParams['id']) =>
  [{ url: '/api/Providers/:id/repositories', params: { id: id } }] as const

export type GetGitRepositoriesSuspenseQueryKey = ReturnType<typeof getGitRepositoriesSuspenseQueryKey>

export function getGitRepositoriesSuspenseQueryOptionsHook(
  id: GetGitRepositoriesPathParams['id'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getGitRepositoriesSuspenseQueryKey(id)
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
export function useGetGitRepositoriesSuspenseHook<
  TData = GetGitRepositoriesQueryResponse,
  TQueryData = GetGitRepositoriesQueryResponse,
  TQueryKey extends QueryKey = GetGitRepositoriesSuspenseQueryKey,
>(
  id: GetGitRepositoriesPathParams['id'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetGitRepositoriesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getGitRepositoriesSuspenseQueryKey(id)

  const query = useSuspenseQuery({
    ...(getGitRepositoriesSuspenseQueryOptionsHook(id, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}