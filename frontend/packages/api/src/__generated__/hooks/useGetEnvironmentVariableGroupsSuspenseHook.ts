import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetEnvironmentVariableGroupsQueryResponse, GetEnvironmentVariableGroupsPathParams } from '../types/GetEnvironmentVariableGroups'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getEnvironmentVariableGroups } from '../axios-backend/getEnvironmentVariableGroups'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getEnvironmentVariableGroupsSuspenseQueryKey = (stackId: GetEnvironmentVariableGroupsPathParams['stackId']) =>
  [{ url: '/api/Stacks/:stackId/environment-variable-groups', params: { stackId: stackId } }] as const

export type GetEnvironmentVariableGroupsSuspenseQueryKey = ReturnType<typeof getEnvironmentVariableGroupsSuspenseQueryKey>

export function getEnvironmentVariableGroupsSuspenseQueryOptionsHook(
  stackId: GetEnvironmentVariableGroupsPathParams['stackId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getEnvironmentVariableGroupsSuspenseQueryKey(stackId)
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
export function useGetEnvironmentVariableGroupsSuspenseHook<
  TData = GetEnvironmentVariableGroupsQueryResponse,
  TQueryData = GetEnvironmentVariableGroupsQueryResponse,
  TQueryKey extends QueryKey = GetEnvironmentVariableGroupsSuspenseQueryKey,
>(
  stackId: GetEnvironmentVariableGroupsPathParams['stackId'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetEnvironmentVariableGroupsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getEnvironmentVariableGroupsSuspenseQueryKey(stackId)

  const query = useSuspenseQuery({
    ...(getEnvironmentVariableGroupsSuspenseQueryOptionsHook(stackId, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}