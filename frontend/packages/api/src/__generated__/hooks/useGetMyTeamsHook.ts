import client from '@cloudcrafter/api/client'
import type { GetMyTeamsQueryResponse } from '../types/GetMyTeams'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getMyTeams } from '../axios-backend/getMyTeams'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getMyTeamsQueryKey = () => [{ url: '/api/Teams' }] as const

export type GetMyTeamsQueryKey = ReturnType<typeof getMyTeamsQueryKey>

export function getMyTeamsQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getMyTeamsQueryKey()
  return queryOptions<GetMyTeamsQueryResponse, ResponseErrorConfig<Error>, GetMyTeamsQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getMyTeams(config)
    },
  })
}

/**
 * {@link /api/Teams}
 */
export function useGetMyTeamsHook<TData = GetMyTeamsQueryResponse, TQueryData = GetMyTeamsQueryResponse, TQueryKey extends QueryKey = GetMyTeamsQueryKey>(
  options: {
    query?: Partial<QueryObserverOptions<GetMyTeamsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getMyTeamsQueryKey()

  const query = useQuery({
    ...(getMyTeamsQueryOptionsHook(config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}