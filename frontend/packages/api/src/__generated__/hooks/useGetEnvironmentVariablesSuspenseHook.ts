import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type {
  GetEnvironmentVariablesQueryResponse,
  GetEnvironmentVariablesPathParams,
  GetEnvironmentVariablesQueryParams,
} from '../types/GetEnvironmentVariables'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getEnvironmentVariables } from '../axios-backend/getEnvironmentVariables'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getEnvironmentVariablesSuspenseQueryKey = (stackId: GetEnvironmentVariablesPathParams['stackId'], params?: GetEnvironmentVariablesQueryParams) =>
  [{ url: '/api/Stacks/:stackId/environment-variables', params: { stackId: stackId } }, ...(params ? [params] : [])] as const

export type GetEnvironmentVariablesSuspenseQueryKey = ReturnType<typeof getEnvironmentVariablesSuspenseQueryKey>

export function getEnvironmentVariablesSuspenseQueryOptionsHook(
  stackId: GetEnvironmentVariablesPathParams['stackId'],
  params?: GetEnvironmentVariablesQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getEnvironmentVariablesSuspenseQueryKey(stackId, params)
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
export function useGetEnvironmentVariablesSuspenseHook<
  TData = GetEnvironmentVariablesQueryResponse,
  TQueryData = GetEnvironmentVariablesQueryResponse,
  TQueryKey extends QueryKey = GetEnvironmentVariablesSuspenseQueryKey,
>(
  stackId: GetEnvironmentVariablesPathParams['stackId'],
  params?: GetEnvironmentVariablesQueryParams,
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetEnvironmentVariablesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getEnvironmentVariablesSuspenseQueryKey(stackId, params)

  const query = useSuspenseQuery({
    ...(getEnvironmentVariablesSuspenseQueryOptionsHook(stackId, params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}