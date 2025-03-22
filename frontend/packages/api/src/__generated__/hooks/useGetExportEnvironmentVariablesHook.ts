import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type {
  GetExportEnvironmentVariablesQueryResponse,
  GetExportEnvironmentVariablesPathParams,
  GetExportEnvironmentVariablesQueryParams,
} from '../types/GetExportEnvironmentVariables'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getExportEnvironmentVariables } from '../axios-backend/getExportEnvironmentVariables'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getExportEnvironmentVariablesQueryKey = (
  stackId: GetExportEnvironmentVariablesPathParams['stackId'],
  params?: GetExportEnvironmentVariablesQueryParams,
) => [{ url: '/api/Stacks/:stackId/environment-variables/export', params: { stackId: stackId } }, ...(params ? [params] : [])] as const

export type GetExportEnvironmentVariablesQueryKey = ReturnType<typeof getExportEnvironmentVariablesQueryKey>

export function getExportEnvironmentVariablesQueryOptionsHook(
  stackId: GetExportEnvironmentVariablesPathParams['stackId'],
  params?: GetExportEnvironmentVariablesQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getExportEnvironmentVariablesQueryKey(stackId, params)
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
export function useGetExportEnvironmentVariablesHook<
  TData = GetExportEnvironmentVariablesQueryResponse,
  TQueryData = GetExportEnvironmentVariablesQueryResponse,
  TQueryKey extends QueryKey = GetExportEnvironmentVariablesQueryKey,
>(
  stackId: GetExportEnvironmentVariablesPathParams['stackId'],
  params?: GetExportEnvironmentVariablesQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<GetExportEnvironmentVariablesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getExportEnvironmentVariablesQueryKey(stackId, params)

  const query = useQuery({
    ...(getExportEnvironmentVariablesQueryOptionsHook(stackId, params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}