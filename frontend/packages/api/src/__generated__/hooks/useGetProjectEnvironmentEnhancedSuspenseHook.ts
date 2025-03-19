import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type {
  GetProjectEnvironmentEnhancedQueryResponse,
  GetProjectEnvironmentEnhancedPathParams,
  GetProjectEnvironmentEnhanced404,
} from '../types/GetProjectEnvironmentEnhanced'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getProjectEnvironmentEnhanced } from '../axios-backend/getProjectEnvironmentEnhanced'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getProjectEnvironmentEnhancedSuspenseQueryKey = (
  id: GetProjectEnvironmentEnhancedPathParams['id'],
  environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
) => [{ url: '/api/Projects/:id/:environmentId', params: { id: id, environmentId: environmentId } }] as const

export type GetProjectEnvironmentEnhancedSuspenseQueryKey = ReturnType<typeof getProjectEnvironmentEnhancedSuspenseQueryKey>

export function getProjectEnvironmentEnhancedSuspenseQueryOptionsHook(
  id: GetProjectEnvironmentEnhancedPathParams['id'],
  environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getProjectEnvironmentEnhancedSuspenseQueryKey(id, environmentId)
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
export function useGetProjectEnvironmentEnhancedSuspenseHook<
  TData = GetProjectEnvironmentEnhancedQueryResponse,
  TQueryData = GetProjectEnvironmentEnhancedQueryResponse,
  TQueryKey extends QueryKey = GetProjectEnvironmentEnhancedSuspenseQueryKey,
>(
  id: GetProjectEnvironmentEnhancedPathParams['id'],
  environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
  options: {
    query?: Partial<
      UseSuspenseQueryOptions<GetProjectEnvironmentEnhancedQueryResponse, ResponseErrorConfig<GetProjectEnvironmentEnhanced404>, TData, TQueryKey>
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getProjectEnvironmentEnhancedSuspenseQueryKey(id, environmentId)

  const query = useSuspenseQuery({
    ...(getProjectEnvironmentEnhancedSuspenseQueryOptionsHook(id, environmentId, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<GetProjectEnvironmentEnhanced404>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}