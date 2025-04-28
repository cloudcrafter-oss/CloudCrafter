import client from '@cloudcrafter/api/client'
import type { GetAllTeamsQueryResponse } from '../types/GetAllTeams'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getAllTeams } from '../axios-backend/getAllTeams'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getAllTeamsQueryKey = () => [{ url: '/api/Teams/all' }] as const

export type GetAllTeamsQueryKey = ReturnType<typeof getAllTeamsQueryKey>

export function getAllTeamsQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getAllTeamsQueryKey()
  return queryOptions<GetAllTeamsQueryResponse, ResponseErrorConfig<Error>, GetAllTeamsQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getAllTeams(config)
    },
  })
}

/**
 * {@link /api/Teams/all}
 */
export function useGetAllTeamsHook<TData = GetAllTeamsQueryResponse, TQueryData = GetAllTeamsQueryResponse, TQueryKey extends QueryKey = GetAllTeamsQueryKey>(
  options: {
    query?: Partial<QueryObserverOptions<GetAllTeamsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getAllTeamsQueryKey()

  const query = useQuery({
    ...(getAllTeamsQueryOptionsHook(config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}