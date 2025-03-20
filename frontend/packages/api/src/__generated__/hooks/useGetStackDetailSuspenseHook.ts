import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetStackDetailQueryResponse, GetStackDetailPathParams, GetStackDetail404 } from '../types/GetStackDetail'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getStackDetail } from '../axios-backend/getStackDetail'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getStackDetailSuspenseQueryKey = (id: GetStackDetailPathParams['id']) => [{ url: '/api/Stacks/:id', params: { id: id } }] as const

export type GetStackDetailSuspenseQueryKey = ReturnType<typeof getStackDetailSuspenseQueryKey>

export function getStackDetailSuspenseQueryOptionsHook(id: GetStackDetailPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getStackDetailSuspenseQueryKey(id)
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
export function useGetStackDetailSuspenseHook<
  TData = GetStackDetailQueryResponse,
  TQueryData = GetStackDetailQueryResponse,
  TQueryKey extends QueryKey = GetStackDetailSuspenseQueryKey,
>(
  id: GetStackDetailPathParams['id'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetStackDetailQueryResponse, ResponseErrorConfig<GetStackDetail404>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getStackDetailSuspenseQueryKey(id)

  const query = useSuspenseQuery({
    ...(getStackDetailSuspenseQueryOptionsHook(id, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<GetStackDetail404>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}