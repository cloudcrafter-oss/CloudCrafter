import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetProjectsQueryResponse, GetProjectsQueryParams } from '../types/GetProjects'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getProjects } from '../axios-backend/getProjects'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getProjectsQueryKey = (params?: GetProjectsQueryParams) => [{ url: '/api/Projects' }, ...(params ? [params] : [])] as const

export type GetProjectsQueryKey = ReturnType<typeof getProjectsQueryKey>

export function getProjectsQueryOptionsHook(params?: GetProjectsQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getProjectsQueryKey(params)
  return queryOptions<GetProjectsQueryResponse, ResponseErrorConfig<Error>, GetProjectsQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getProjects(params, config)
    },
  })
}

/**
 * {@link /api/Projects}
 */
export function useGetProjectsHook<TData = GetProjectsQueryResponse, TQueryData = GetProjectsQueryResponse, TQueryKey extends QueryKey = GetProjectsQueryKey>(
  params?: GetProjectsQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<GetProjectsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getProjectsQueryKey(params)

  const query = useQuery({
    ...(getProjectsQueryOptionsHook(params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}