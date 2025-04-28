import client from '@cloudcrafter/api/client'
import type { GetMyTeamsWithProjectsAndEnvironmentsQueryResponse } from '../types/GetMyTeamsWithProjectsAndEnvironments'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getMyTeamsWithProjectsAndEnvironments } from '../axios-backend/getMyTeamsWithProjectsAndEnvironments'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getMyTeamsWithProjectsAndEnvironmentsQueryKey = () => [{ url: '/api/Teams/projects-and-environments' }] as const

export type GetMyTeamsWithProjectsAndEnvironmentsQueryKey = ReturnType<typeof getMyTeamsWithProjectsAndEnvironmentsQueryKey>

export function getMyTeamsWithProjectsAndEnvironmentsQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getMyTeamsWithProjectsAndEnvironmentsQueryKey()
  return queryOptions<
    GetMyTeamsWithProjectsAndEnvironmentsQueryResponse,
    ResponseErrorConfig<Error>,
    GetMyTeamsWithProjectsAndEnvironmentsQueryResponse,
    typeof queryKey
  >({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getMyTeamsWithProjectsAndEnvironments(config)
    },
  })
}

/**
 * {@link /api/Teams/projects-and-environments}
 */
export function useGetMyTeamsWithProjectsAndEnvironmentsHook<
  TData = GetMyTeamsWithProjectsAndEnvironmentsQueryResponse,
  TQueryData = GetMyTeamsWithProjectsAndEnvironmentsQueryResponse,
  TQueryKey extends QueryKey = GetMyTeamsWithProjectsAndEnvironmentsQueryKey,
>(
  options: {
    query?: Partial<QueryObserverOptions<GetMyTeamsWithProjectsAndEnvironmentsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getMyTeamsWithProjectsAndEnvironmentsQueryKey()

  const query = useQuery({
    ...(getMyTeamsWithProjectsAndEnvironmentsQueryOptionsHook(config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}