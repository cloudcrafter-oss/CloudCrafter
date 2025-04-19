import client from '@cloudcrafter/api/client'
import type { GetAllTeamsQueryResponse } from '../types/GetAllTeams'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getAllTeams } from '../axios-backend/getAllTeams'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getAllTeamsSuspenseQueryKey = () => [{ url: '/api/Teams/all' }] as const

export type GetAllTeamsSuspenseQueryKey = ReturnType<typeof getAllTeamsSuspenseQueryKey>

export function getAllTeamsSuspenseQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getAllTeamsSuspenseQueryKey()
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
export function useGetAllTeamsSuspenseHook<
  TData = GetAllTeamsQueryResponse,
  TQueryData = GetAllTeamsQueryResponse,
  TQueryKey extends QueryKey = GetAllTeamsSuspenseQueryKey,
>(
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetAllTeamsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getAllTeamsSuspenseQueryKey()

  const query = useSuspenseQuery({
    ...(getAllTeamsSuspenseQueryOptionsHook(config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}