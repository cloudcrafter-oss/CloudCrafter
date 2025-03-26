import client from '@cloudcrafter/api/client'
import type { GetProjectQueryResponse, GetProjectPathParams, GetProject404 } from '../types/GetProject'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getProject } from '../axios-backend/getProject'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getProjectQueryKey = (id: GetProjectPathParams['id']) => [{ url: '/api/Projects/:id', params: { id: id } }] as const

export type GetProjectQueryKey = ReturnType<typeof getProjectQueryKey>

export function getProjectQueryOptionsHook(id: GetProjectPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getProjectQueryKey(id)
  return queryOptions<GetProjectQueryResponse, ResponseErrorConfig<GetProject404>, GetProjectQueryResponse, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getProject(id, config)
    },
  })
}

/**
 * {@link /api/Projects/:id}
 */
export function useGetProjectHook<TData = GetProjectQueryResponse, TQueryData = GetProjectQueryResponse, TQueryKey extends QueryKey = GetProjectQueryKey>(
  id: GetProjectPathParams['id'],
  options: {
    query?: Partial<QueryObserverOptions<GetProjectQueryResponse, ResponseErrorConfig<GetProject404>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getProjectQueryKey(id)

  const query = useQuery({
    ...(getProjectQueryOptionsHook(id, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<GetProject404>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}