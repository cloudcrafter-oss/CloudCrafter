import client from '@cloudcrafter/api/client'
import type { GetServerByIdQueryResponse, GetServerByIdPathParams } from '../types/GetServerById'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getServerById } from '../axios-backend/getServerById'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getServerByIdQueryKey = (id: GetServerByIdPathParams['id']) => [{ url: '/api/Servers/:id', params: { id: id } }] as const

export type GetServerByIdQueryKey = ReturnType<typeof getServerByIdQueryKey>

export function getServerByIdQueryOptionsHook(id: GetServerByIdPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getServerByIdQueryKey(id)
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
export function useGetServerByIdHook<
  TData = GetServerByIdQueryResponse,
  TQueryData = GetServerByIdQueryResponse,
  TQueryKey extends QueryKey = GetServerByIdQueryKey,
>(
  id: GetServerByIdPathParams['id'],
  options: {
    query?: Partial<QueryObserverOptions<GetServerByIdQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getServerByIdQueryKey(id)

  const query = useQuery({
    ...(getServerByIdQueryOptionsHook(id, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}