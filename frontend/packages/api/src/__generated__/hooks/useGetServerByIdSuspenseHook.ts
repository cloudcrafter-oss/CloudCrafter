import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetServerByIdQueryResponse, GetServerByIdPathParams } from '../types/GetServerById'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getServerById } from '../axios-backend/getServerById'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getServerByIdSuspenseQueryKey = (id: GetServerByIdPathParams['id']) => [{ url: '/api/Servers/:id', params: { id: id } }] as const

export type GetServerByIdSuspenseQueryKey = ReturnType<typeof getServerByIdSuspenseQueryKey>

export function getServerByIdSuspenseQueryOptionsHook(id: GetServerByIdPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getServerByIdSuspenseQueryKey(id)
  return queryOptions<GetServerByIdQueryResponse, ResponseErrorConfig<Error>, GetServerByIdQueryResponse, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getServerById(id, config)
    },
  })
}

/**
 * {@link /api/Servers/:id}
 */
export function useGetServerByIdSuspenseHook<
  TData = GetServerByIdQueryResponse,
  TQueryData = GetServerByIdQueryResponse,
  TQueryKey extends QueryKey = GetServerByIdSuspenseQueryKey,
>(
  id: GetServerByIdPathParams['id'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetServerByIdQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getServerByIdSuspenseQueryKey(id)

  const query = useSuspenseQuery({
    ...(getServerByIdSuspenseQueryOptionsHook(id, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}