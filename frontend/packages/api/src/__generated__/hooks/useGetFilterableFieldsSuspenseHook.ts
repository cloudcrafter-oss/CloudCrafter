import client from '@cloudcrafter/api/client'
import type { GetFilterableFieldsQueryResponse } from '../types/GetFilterableFields'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getFilterableFields } from '../axios-backend/getFilterableFields'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getFilterableFieldsSuspenseQueryKey = () => [{ url: '/api/System/get-fields' }] as const

export type GetFilterableFieldsSuspenseQueryKey = ReturnType<typeof getFilterableFieldsSuspenseQueryKey>

export function getFilterableFieldsSuspenseQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getFilterableFieldsSuspenseQueryKey()
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
export function useGetFilterableFieldsSuspenseHook<
  TData = GetFilterableFieldsQueryResponse,
  TQueryData = GetFilterableFieldsQueryResponse,
  TQueryKey extends QueryKey = GetFilterableFieldsSuspenseQueryKey,
>(
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetFilterableFieldsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getFilterableFieldsSuspenseQueryKey()

  const query = useSuspenseQuery({
    ...(getFilterableFieldsSuspenseQueryOptionsHook(config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}