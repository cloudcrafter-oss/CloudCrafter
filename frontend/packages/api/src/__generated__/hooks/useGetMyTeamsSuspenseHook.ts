import client from '@cloudcrafter/api/client'
import type { GetMyTeamsQueryResponse } from '../types/GetMyTeams'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getMyTeams } from '../axios-backend/getMyTeams'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getMyTeamsSuspenseQueryKey = () => [{ url: '/api/Teams' }] as const

export type GetMyTeamsSuspenseQueryKey = ReturnType<typeof getMyTeamsSuspenseQueryKey>

export function getMyTeamsSuspenseQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getMyTeamsSuspenseQueryKey()
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
export function useGetMyTeamsSuspenseHook<
  TData = GetMyTeamsQueryResponse,
  TQueryData = GetMyTeamsQueryResponse,
  TQueryKey extends QueryKey = GetMyTeamsSuspenseQueryKey,
>(
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetMyTeamsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getMyTeamsSuspenseQueryKey()

  const query = useSuspenseQuery({
    ...(getMyTeamsSuspenseQueryOptionsHook(config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}