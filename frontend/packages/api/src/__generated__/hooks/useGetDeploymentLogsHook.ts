import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetDeploymentLogsQueryResponse, GetDeploymentLogsPathParams } from '../types/GetDeploymentLogs'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getDeploymentLogs } from '../axios-backend/getDeploymentLogs'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getDeploymentLogsQueryKey = (deploymentId: GetDeploymentLogsPathParams['deploymentId']) =>
  [{ url: '/api/Stacks/deployments/:deploymentId/logs', params: { deploymentId: deploymentId } }] as const

export type GetDeploymentLogsQueryKey = ReturnType<typeof getDeploymentLogsQueryKey>

export function getDeploymentLogsQueryOptionsHook(
  deploymentId: GetDeploymentLogsPathParams['deploymentId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getDeploymentLogsQueryKey(deploymentId)
  return queryOptions<GetDeploymentLogsQueryResponse, ResponseErrorConfig<Error>, GetDeploymentLogsQueryResponse, typeof queryKey>({
    enabled: !!deploymentId,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getDeploymentLogs(deploymentId, config)
    },
  })
}

/**
 * {@link /api/Stacks/deployments/:deploymentId/logs}
 */
export function useGetDeploymentLogsHook<
  TData = GetDeploymentLogsQueryResponse,
  TQueryData = GetDeploymentLogsQueryResponse,
  TQueryKey extends QueryKey = GetDeploymentLogsQueryKey,
>(
  deploymentId: GetDeploymentLogsPathParams['deploymentId'],
  options: {
    query?: Partial<QueryObserverOptions<GetDeploymentLogsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDeploymentLogsQueryKey(deploymentId)

  const query = useQuery({
    ...(getDeploymentLogsQueryOptionsHook(deploymentId, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}