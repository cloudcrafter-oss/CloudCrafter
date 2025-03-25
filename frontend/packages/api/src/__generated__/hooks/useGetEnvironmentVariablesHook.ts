import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type {
  GetEnvironmentVariablesQueryResponse,
  GetEnvironmentVariablesPathParams,
  GetEnvironmentVariablesQueryParams,
} from '../types/GetEnvironmentVariables'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getEnvironmentVariables } from '../axios-backend/getEnvironmentVariables'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getEnvironmentVariablesQueryKey = (stackId: GetEnvironmentVariablesPathParams['stackId'], params?: GetEnvironmentVariablesQueryParams) =>
  [{ url: '/api/Stacks/:stackId/environment-variables', params: { stackId: stackId } }, ...(params ? [params] : [])] as const

export type GetEnvironmentVariablesQueryKey = ReturnType<typeof getEnvironmentVariablesQueryKey>

export function getEnvironmentVariablesQueryOptionsHook(
  stackId: GetEnvironmentVariablesPathParams['stackId'],
  params?: GetEnvironmentVariablesQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getEnvironmentVariablesQueryKey(stackId, params)
  return queryOptions<GetEnvironmentVariablesQueryResponse, ResponseErrorConfig<Error>, GetEnvironmentVariablesQueryResponse, typeof queryKey>({
    enabled: !!stackId,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getEnvironmentVariables(stackId, params, config)
    },
  })
}

/**
 * {@link /api/Stacks/:stackId/environment-variables}
 */
export function useGetEnvironmentVariablesHook<
  TData = GetEnvironmentVariablesQueryResponse,
  TQueryData = GetEnvironmentVariablesQueryResponse,
  TQueryKey extends QueryKey = GetEnvironmentVariablesQueryKey,
>(
  stackId: GetEnvironmentVariablesPathParams['stackId'],
  params?: GetEnvironmentVariablesQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<GetEnvironmentVariablesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getEnvironmentVariablesQueryKey(stackId, params)

  const query = useQuery({
    ...(getEnvironmentVariablesQueryOptionsHook(stackId, params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}