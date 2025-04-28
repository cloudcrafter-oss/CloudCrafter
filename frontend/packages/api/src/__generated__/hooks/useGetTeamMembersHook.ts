import client from '@cloudcrafter/api/client'
import type { GetTeamMembersQueryResponse, GetTeamMembersPathParams, GetTeamMembersQueryParams } from '../types/GetTeamMembers'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getTeamMembers } from '../axios-backend/getTeamMembers'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getTeamMembersQueryKey = (teamId: GetTeamMembersPathParams['teamId'], params?: GetTeamMembersQueryParams) =>
  [{ url: '/api/Teams/:teamId', params: { teamId: teamId } }, ...(params ? [params] : [])] as const

export type GetTeamMembersQueryKey = ReturnType<typeof getTeamMembersQueryKey>

export function getTeamMembersQueryOptionsHook(
  teamId: GetTeamMembersPathParams['teamId'],
  params?: GetTeamMembersQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getTeamMembersQueryKey(teamId, params)
  return queryOptions<GetTeamMembersQueryResponse, ResponseErrorConfig<Error>, GetTeamMembersQueryResponse, typeof queryKey>({
    enabled: !!teamId,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getTeamMembers(teamId, params, config)
    },
  })
}

/**
 * {@link /api/Teams/:teamId}
 */
export function useGetTeamMembersHook<
  TData = GetTeamMembersQueryResponse,
  TQueryData = GetTeamMembersQueryResponse,
  TQueryKey extends QueryKey = GetTeamMembersQueryKey,
>(
  teamId: GetTeamMembersPathParams['teamId'],
  params?: GetTeamMembersQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<GetTeamMembersQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getTeamMembersQueryKey(teamId, params)

  const query = useQuery({
    ...(getTeamMembersQueryOptionsHook(teamId, params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}