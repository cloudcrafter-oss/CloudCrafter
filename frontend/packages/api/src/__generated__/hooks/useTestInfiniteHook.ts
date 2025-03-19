import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { TestQueryResponse } from '../types/Test'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { test } from '../axios-backend/test'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const testInfiniteQueryKey = () => [{ url: '/api/Users/test' }] as const

export type TestInfiniteQueryKey = ReturnType<typeof testInfiniteQueryKey>

export function testInfiniteQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = testInfiniteQueryKey()
  return infiniteQueryOptions<TestQueryResponse, ResponseErrorConfig<Error>, TestQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return test(config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /api/Users/test}
 */
export function useTestInfiniteHook<TData = InfiniteData<TestQueryResponse>, TQueryData = TestQueryResponse, TQueryKey extends QueryKey = TestInfiniteQueryKey>(
  options: {
    query?: Partial<InfiniteQueryObserverOptions<TestQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? testInfiniteQueryKey()

  const query = useInfiniteQuery({
    ...(testInfiniteQueryOptionsHook(config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}