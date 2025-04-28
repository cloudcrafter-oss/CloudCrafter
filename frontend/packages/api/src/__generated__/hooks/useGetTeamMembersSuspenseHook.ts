import client from '@cloudcrafter/api/client'
import type { GetTeamMembersQueryResponse, GetTeamMembersPathParams, GetTeamMembersQueryParams } from '../types/GetTeamMembers'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getTeamMembers } from '../axios-backend/getTeamMembers'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getTeamMembersSuspenseQueryKey = (teamId: GetTeamMembersPathParams['teamId'], params?: GetTeamMembersQueryParams) =>
  [{ url: '/api/Teams/:teamId', params: { teamId: teamId } }, ...(params ? [params] : [])] as const

export type GetTeamMembersSuspenseQueryKey = ReturnType<typeof getTeamMembersSuspenseQueryKey>

export function getTeamMembersSuspenseQueryOptionsHook(
  teamId: GetTeamMembersPathParams['teamId'],
  params?: GetTeamMembersQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getTeamMembersSuspenseQueryKey(teamId, params)
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
export function useGetTeamMembersSuspenseHook<
  TData = GetTeamMembersQueryResponse,
  TQueryData = GetTeamMembersQueryResponse,
  TQueryKey extends QueryKey = GetTeamMembersSuspenseQueryKey,
>(
  teamId: GetTeamMembersPathParams['teamId'],
  params?: GetTeamMembersQueryParams,
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetTeamMembersQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getTeamMembersSuspenseQueryKey(teamId, params)

  const query = useSuspenseQuery({
    ...(getTeamMembersSuspenseQueryOptionsHook(teamId, params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}