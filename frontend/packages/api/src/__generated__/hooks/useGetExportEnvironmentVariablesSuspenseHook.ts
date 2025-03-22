import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type {
  GetExportEnvironmentVariablesQueryResponse,
  GetExportEnvironmentVariablesPathParams,
  GetExportEnvironmentVariablesQueryParams,
} from '../types/GetExportEnvironmentVariables'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getExportEnvironmentVariables } from '../axios-backend/getExportEnvironmentVariables'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getExportEnvironmentVariablesSuspenseQueryKey = (
  stackId: GetExportEnvironmentVariablesPathParams['stackId'],
  params?: GetExportEnvironmentVariablesQueryParams,
) => [{ url: '/api/Stacks/:stackId/environment-variables/export', params: { stackId: stackId } }, ...(params ? [params] : [])] as const

export type GetExportEnvironmentVariablesSuspenseQueryKey = ReturnType<typeof getExportEnvironmentVariablesSuspenseQueryKey>

export function getExportEnvironmentVariablesSuspenseQueryOptionsHook(
  stackId: GetExportEnvironmentVariablesPathParams['stackId'],
  params?: GetExportEnvironmentVariablesQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getExportEnvironmentVariablesSuspenseQueryKey(stackId, params)
  return queryOptions<GetExportEnvironmentVariablesQueryResponse, ResponseErrorConfig<Error>, GetExportEnvironmentVariablesQueryResponse, typeof queryKey>({
    enabled: !!stackId,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getExportEnvironmentVariables(stackId, params, config)
    },
  })
}

/**
 * {@link /api/Stacks/:stackId/environment-variables/export}
 */
export function useGetExportEnvironmentVariablesSuspenseHook<
  TData = GetExportEnvironmentVariablesQueryResponse,
  TQueryData = GetExportEnvironmentVariablesQueryResponse,
  TQueryKey extends QueryKey = GetExportEnvironmentVariablesSuspenseQueryKey,
>(
  stackId: GetExportEnvironmentVariablesPathParams['stackId'],
  params?: GetExportEnvironmentVariablesQueryParams,
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetExportEnvironmentVariablesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getExportEnvironmentVariablesSuspenseQueryKey(stackId, params)

  const query = useSuspenseQuery({
    ...(getExportEnvironmentVariablesSuspenseQueryOptionsHook(stackId, params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}