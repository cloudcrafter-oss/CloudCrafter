import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetHistoryQueryResponse, GetHistoryPathParams, GetHistoryQueryParams } from '../types/GetHistory'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getHistory } from '../axios-backend/getHistory'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getHistoryQueryKey = (stackId: GetHistoryPathParams['stackId'], params?: GetHistoryQueryParams) =>
  [{ url: '/api/Stacks/:stackId/environment-variables/history', params: { stackId: stackId } }, ...(params ? [params] : [])] as const

export type GetHistoryQueryKey = ReturnType<typeof getHistoryQueryKey>

export function getHistoryQueryOptionsHook(
  stackId: GetHistoryPathParams['stackId'],
  params?: GetHistoryQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getHistoryQueryKey(stackId, params)
  return queryOptions<GetHistoryQueryResponse, ResponseErrorConfig<Error>, GetHistoryQueryResponse, typeof queryKey>({
    enabled: !!stackId,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getHistory(stackId, params, config)
    },
  })
}

/**
 * {@link /api/Stacks/:stackId/environment-variables/history}
 */
export function useGetHistoryHook<TData = GetHistoryQueryResponse, TQueryData = GetHistoryQueryResponse, TQueryKey extends QueryKey = GetHistoryQueryKey>(
  stackId: GetHistoryPathParams['stackId'],
  params?: GetHistoryQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<GetHistoryQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getHistoryQueryKey(stackId, params)

  const query = useQuery({
    ...(getHistoryQueryOptionsHook(stackId, params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}