import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetFilterableFieldsQueryResponse } from '../types/GetFilterableFields'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { getFilterableFields } from '../axios-backend/getFilterableFields'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getFilterableFieldsInfiniteQueryKey = () => [{ url: '/api/System/get-fields' }] as const

export type GetFilterableFieldsInfiniteQueryKey = ReturnType<typeof getFilterableFieldsInfiniteQueryKey>

export function getFilterableFieldsInfiniteQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getFilterableFieldsInfiniteQueryKey()
  return infiniteQueryOptions<GetFilterableFieldsQueryResponse, ResponseErrorConfig<Error>, GetFilterableFieldsQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getFilterableFields(config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /api/System/get-fields}
 */
export function useGetFilterableFieldsInfiniteHook<
  TData = InfiniteData<GetFilterableFieldsQueryResponse>,
  TQueryData = GetFilterableFieldsQueryResponse,
  TQueryKey extends QueryKey = GetFilterableFieldsInfiniteQueryKey,
>(
  options: {
    query?: Partial<InfiniteQueryObserverOptions<GetFilterableFieldsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getFilterableFieldsInfiniteQueryKey()

  const query = useInfiniteQuery({
    ...(getFilterableFieldsInfiniteQueryOptionsHook(config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}