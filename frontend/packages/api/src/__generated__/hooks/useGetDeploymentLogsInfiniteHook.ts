import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetDeploymentLogsQueryResponse, GetDeploymentLogsPathParams } from '../types/GetDeploymentLogs'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { getDeploymentLogs } from '../axios-backend/getDeploymentLogs'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getDeploymentLogsInfiniteQueryKey = (deploymentId: GetDeploymentLogsPathParams['deploymentId']) =>
  [{ url: '/api/Stacks/deployments/:deploymentId/logs', params: { deploymentId: deploymentId } }] as const

export type GetDeploymentLogsInfiniteQueryKey = ReturnType<typeof getDeploymentLogsInfiniteQueryKey>

export function getDeploymentLogsInfiniteQueryOptionsHook(
  deploymentId: GetDeploymentLogsPathParams['deploymentId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getDeploymentLogsInfiniteQueryKey(deploymentId)
  return infiniteQueryOptions<GetDeploymentLogsQueryResponse, ResponseErrorConfig<Error>, GetDeploymentLogsQueryResponse, typeof queryKey>({
    enabled: !!deploymentId,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getDeploymentLogs(deploymentId, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /api/Stacks/deployments/:deploymentId/logs}
 */
export function useGetDeploymentLogsInfiniteHook<
  TData = InfiniteData<GetDeploymentLogsQueryResponse>,
  TQueryData = GetDeploymentLogsQueryResponse,
  TQueryKey extends QueryKey = GetDeploymentLogsInfiniteQueryKey,
>(
  deploymentId: GetDeploymentLogsPathParams['deploymentId'],
  options: {
    query?: Partial<InfiniteQueryObserverOptions<GetDeploymentLogsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDeploymentLogsInfiniteQueryKey(deploymentId)

  const query = useInfiniteQuery({
    ...(getDeploymentLogsInfiniteQueryOptionsHook(deploymentId, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}