import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetEnvironmentVariableGroupsQueryResponse, GetEnvironmentVariableGroupsPathParams } from '../types/GetEnvironmentVariableGroups'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getEnvironmentVariableGroups } from '../axios-backend/getEnvironmentVariableGroups'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getEnvironmentVariableGroupsQueryKey = (stackId: GetEnvironmentVariableGroupsPathParams['stackId']) =>
  [{ url: '/api/Stacks/:stackId/environment-variable-groups', params: { stackId: stackId } }] as const

export type GetEnvironmentVariableGroupsQueryKey = ReturnType<typeof getEnvironmentVariableGroupsQueryKey>

export function getEnvironmentVariableGroupsQueryOptionsHook(
  stackId: GetEnvironmentVariableGroupsPathParams['stackId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getEnvironmentVariableGroupsQueryKey(stackId)
  return queryOptions<GetEnvironmentVariableGroupsQueryResponse, ResponseErrorConfig<Error>, GetEnvironmentVariableGroupsQueryResponse, typeof queryKey>({
    enabled: !!stackId,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getEnvironmentVariableGroups(stackId, config)
    },
  })
}

/**
 * {@link /api/Stacks/:stackId/environment-variable-groups}
 */
export function useGetEnvironmentVariableGroupsHook<
  TData = GetEnvironmentVariableGroupsQueryResponse,
  TQueryData = GetEnvironmentVariableGroupsQueryResponse,
  TQueryKey extends QueryKey = GetEnvironmentVariableGroupsQueryKey,
>(
  stackId: GetEnvironmentVariableGroupsPathParams['stackId'],
  options: {
    query?: Partial<QueryObserverOptions<GetEnvironmentVariableGroupsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getEnvironmentVariableGroupsQueryKey(stackId)

  const query = useQuery({
    ...(getEnvironmentVariableGroupsQueryOptionsHook(stackId, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}