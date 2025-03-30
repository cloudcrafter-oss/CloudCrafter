import client from '@cloudcrafter/api/client'
import type {
  GetProjectEnvironmentEnhancedQueryResponse,
  GetProjectEnvironmentEnhancedPathParams,
  GetProjectEnvironmentEnhanced404,
} from '../types/GetProjectEnvironmentEnhanced'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getProjectEnvironmentEnhanced } from '../axios-backend/getProjectEnvironmentEnhanced'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getProjectEnvironmentEnhancedQueryKey = (
  id: GetProjectEnvironmentEnhancedPathParams['id'],
  environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
) => [{ url: '/api/Projects/:id/:environmentId', params: { id: id, environmentId: environmentId } }] as const

export type GetProjectEnvironmentEnhancedQueryKey = ReturnType<typeof getProjectEnvironmentEnhancedQueryKey>

export function getProjectEnvironmentEnhancedQueryOptionsHook(
  id: GetProjectEnvironmentEnhancedPathParams['id'],
  environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getProjectEnvironmentEnhancedQueryKey(id, environmentId)
  return queryOptions<
    GetProjectEnvironmentEnhancedQueryResponse,
    ResponseErrorConfig<GetProjectEnvironmentEnhanced404>,
    GetProjectEnvironmentEnhancedQueryResponse,
    typeof queryKey
  >({
    enabled: !!(id && environmentId),
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getProjectEnvironmentEnhanced(id, environmentId, config)
    },
  })
}

/**
 * {@link /api/Projects/:id/:environmentId}
 */
export function useGetProjectEnvironmentEnhancedHook<
  TData = GetProjectEnvironmentEnhancedQueryResponse,
  TQueryData = GetProjectEnvironmentEnhancedQueryResponse,
  TQueryKey extends QueryKey = GetProjectEnvironmentEnhancedQueryKey,
>(
  id: GetProjectEnvironmentEnhancedPathParams['id'],
  environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
  options: {
    query?: Partial<
      QueryObserverOptions<GetProjectEnvironmentEnhancedQueryResponse, ResponseErrorConfig<GetProjectEnvironmentEnhanced404>, TData, TQueryData, TQueryKey>
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getProjectEnvironmentEnhancedQueryKey(id, environmentId)

  const query = useQuery({
    ...(getProjectEnvironmentEnhancedQueryOptionsHook(id, environmentId, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<GetProjectEnvironmentEnhanced404>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}