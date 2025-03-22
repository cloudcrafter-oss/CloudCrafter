import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetHistoryQueryResponse, GetHistoryPathParams, GetHistoryQueryParams } from '../types/GetHistory'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getHistory } from '../axios-backend/getHistory'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getHistorySuspenseQueryKey = (stackId: GetHistoryPathParams['stackId'], params?: GetHistoryQueryParams) =>
  [{ url: '/api/Stacks/:stackId/environment-variables/history', params: { stackId: stackId } }, ...(params ? [params] : [])] as const

export type GetHistorySuspenseQueryKey = ReturnType<typeof getHistorySuspenseQueryKey>

export function getHistorySuspenseQueryOptionsHook(
  stackId: GetHistoryPathParams['stackId'],
  params?: GetHistoryQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getHistorySuspenseQueryKey(stackId, params)
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
export function useGetHistorySuspenseHook<
  TData = GetHistoryQueryResponse,
  TQueryData = GetHistoryQueryResponse,
  TQueryKey extends QueryKey = GetHistorySuspenseQueryKey,
>(
  stackId: GetHistoryPathParams['stackId'],
  params?: GetHistoryQueryParams,
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetHistoryQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getHistorySuspenseQueryKey(stackId, params)

  const query = useSuspenseQuery({
    ...(getHistorySuspenseQueryOptionsHook(stackId, params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}