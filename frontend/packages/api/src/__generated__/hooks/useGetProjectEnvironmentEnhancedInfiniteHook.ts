import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type {
  GetProjectEnvironmentEnhancedQueryResponse,
  GetProjectEnvironmentEnhancedPathParams,
  GetProjectEnvironmentEnhanced404,
} from '../types/GetProjectEnvironmentEnhanced'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { getProjectEnvironmentEnhanced } from '../axios-backend/getProjectEnvironmentEnhanced'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getProjectEnvironmentEnhancedInfiniteQueryKey = (
  id: GetProjectEnvironmentEnhancedPathParams['id'],
  environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
) => [{ url: '/api/Projects/:id/:environmentId', params: { id: id, environmentId: environmentId } }] as const

export type GetProjectEnvironmentEnhancedInfiniteQueryKey = ReturnType<typeof getProjectEnvironmentEnhancedInfiniteQueryKey>

export function getProjectEnvironmentEnhancedInfiniteQueryOptionsHook(
  id: GetProjectEnvironmentEnhancedPathParams['id'],
  environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getProjectEnvironmentEnhancedInfiniteQueryKey(id, environmentId)
  return infiniteQueryOptions<
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
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /api/Projects/:id/:environmentId}
 */
export function useGetProjectEnvironmentEnhancedInfiniteHook<
  TData = InfiniteData<GetProjectEnvironmentEnhancedQueryResponse>,
  TQueryData = GetProjectEnvironmentEnhancedQueryResponse,
  TQueryKey extends QueryKey = GetProjectEnvironmentEnhancedInfiniteQueryKey,
>(
  id: GetProjectEnvironmentEnhancedPathParams['id'],
  environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
  options: {
    query?: Partial<
      InfiniteQueryObserverOptions<
        GetProjectEnvironmentEnhancedQueryResponse,
        ResponseErrorConfig<GetProjectEnvironmentEnhanced404>,
        TData,
        TQueryData,
        TQueryKey
      >
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getProjectEnvironmentEnhancedInfiniteQueryKey(id, environmentId)

  const query = useInfiniteQuery({
    ...(getProjectEnvironmentEnhancedInfiniteQueryOptionsHook(id, environmentId, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<GetProjectEnvironmentEnhanced404>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}