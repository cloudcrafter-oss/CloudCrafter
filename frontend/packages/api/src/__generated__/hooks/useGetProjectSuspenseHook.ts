import client from '@cloudcrafter/api/client'
import type { GetProjectQueryResponse, GetProjectPathParams, GetProject404 } from '../types/GetProject'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getProject } from '../axios-backend/getProject'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getProjectSuspenseQueryKey = (id: GetProjectPathParams['id']) => [{ url: '/api/Projects/:id', params: { id: id } }] as const

export type GetProjectSuspenseQueryKey = ReturnType<typeof getProjectSuspenseQueryKey>

export function getProjectSuspenseQueryOptionsHook(id: GetProjectPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getProjectSuspenseQueryKey(id)
  return queryOptions<GetProjectQueryResponse, ResponseErrorConfig<GetProject404>, GetProjectQueryResponse, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getProject(id, config)
    },
  })
}

/**
 * {@link /api/Projects/:id}
 */
export function useGetProjectSuspenseHook<
  TData = GetProjectQueryResponse,
  TQueryData = GetProjectQueryResponse,
  TQueryKey extends QueryKey = GetProjectSuspenseQueryKey,
>(
  id: GetProjectPathParams['id'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetProjectQueryResponse, ResponseErrorConfig<GetProject404>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getProjectSuspenseQueryKey(id)

  const query = useSuspenseQuery({
    ...(getProjectSuspenseQueryOptionsHook(id, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<GetProject404>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}