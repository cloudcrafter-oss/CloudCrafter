import client from '@cloudcrafter/api/client'
import type { GetFilterableFieldsQueryResponse } from '../types/GetFilterableFields'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getFilterableFields } from '../axios-backend/getFilterableFields'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getFilterableFieldsQueryKey = () => [{ url: '/api/System/get-fields' }] as const

export type GetFilterableFieldsQueryKey = ReturnType<typeof getFilterableFieldsQueryKey>

export function getFilterableFieldsQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getFilterableFieldsQueryKey()
  return queryOptions<GetFilterableFieldsQueryResponse, ResponseErrorConfig<Error>, GetFilterableFieldsQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getFilterableFields(config)
    },
  })
}

/**
 * {@link /api/System/get-fields}
 */
export function useGetFilterableFieldsHook<
  TData = GetFilterableFieldsQueryResponse,
  TQueryData = GetFilterableFieldsQueryResponse,
  TQueryKey extends QueryKey = GetFilterableFieldsQueryKey,
>(
  options: {
    query?: Partial<QueryObserverOptions<GetFilterableFieldsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getFilterableFieldsQueryKey()

  const query = useQuery({
    ...(getFilterableFieldsQueryOptionsHook(config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}