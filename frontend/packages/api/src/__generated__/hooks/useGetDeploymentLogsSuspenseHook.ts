import client from '@cloudcrafter/api/client'
import type { GetDeploymentLogsQueryResponse, GetDeploymentLogsPathParams } from '../types/GetDeploymentLogs'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getDeploymentLogs } from '../axios-backend/getDeploymentLogs'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getDeploymentLogsSuspenseQueryKey = (deploymentId: GetDeploymentLogsPathParams['deploymentId']) =>
  [{ url: '/api/Stacks/deployments/:deploymentId/logs', params: { deploymentId: deploymentId } }] as const

export type GetDeploymentLogsSuspenseQueryKey = ReturnType<typeof getDeploymentLogsSuspenseQueryKey>

export function getDeploymentLogsSuspenseQueryOptionsHook(
  deploymentId: GetDeploymentLogsPathParams['deploymentId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getDeploymentLogsSuspenseQueryKey(deploymentId)
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
export function useGetDeploymentLogsSuspenseHook<
  TData = GetDeploymentLogsQueryResponse,
  TQueryData = GetDeploymentLogsQueryResponse,
  TQueryKey extends QueryKey = GetDeploymentLogsSuspenseQueryKey,
>(
  deploymentId: GetDeploymentLogsPathParams['deploymentId'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetDeploymentLogsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDeploymentLogsSuspenseQueryKey(deploymentId)

  const query = useSuspenseQuery({
    ...(getDeploymentLogsSuspenseQueryOptionsHook(deploymentId, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}