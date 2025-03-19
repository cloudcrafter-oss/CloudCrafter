import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetStackDetailQueryResponse, GetStackDetailPathParams, GetStackDetail404 } from '../types/GetStackDetail'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getStackDetail } from '../axios-backend/getStackDetail'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getStackDetailQueryKey = (id: GetStackDetailPathParams['id']) => [{ url: '/api/Stacks/:id', params: { id: id } }] as const

export type GetStackDetailQueryKey = ReturnType<typeof getStackDetailQueryKey>

export function getStackDetailQueryOptionsHook(id: GetStackDetailPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getStackDetailQueryKey(id)
  return queryOptions<GetStackDetailQueryResponse, ResponseErrorConfig<GetStackDetail404>, GetStackDetailQueryResponse, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getStackDetail(id, config)
    },
  })
}

/**
 * {@link /api/Stacks/:id}
 */
export function useGetStackDetailHook<
  TData = GetStackDetailQueryResponse,
  TQueryData = GetStackDetailQueryResponse,
  TQueryKey extends QueryKey = GetStackDetailQueryKey,
>(
  id: GetStackDetailPathParams['id'],
  options: {
    query?: Partial<QueryObserverOptions<GetStackDetailQueryResponse, ResponseErrorConfig<GetStackDetail404>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getStackDetailQueryKey(id)

  const query = useQuery({
    ...(getStackDetailQueryOptionsHook(id, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<GetStackDetail404>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}