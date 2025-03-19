import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { TestQueryResponse } from '../types/Test'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { test } from '../axios-backend/test'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const testQueryKey = () => [{ url: '/api/Users/test' }] as const

export type TestQueryKey = ReturnType<typeof testQueryKey>

export function testQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = testQueryKey()
  return queryOptions<TestQueryResponse, ResponseErrorConfig<Error>, TestQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return test(config)
    },
  })
}

/**
 * {@link /api/Users/test}
 */
export function useTestHook<TData = TestQueryResponse, TQueryData = TestQueryResponse, TQueryKey extends QueryKey = TestQueryKey>(
  options: {
    query?: Partial<QueryObserverOptions<TestQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? testQueryKey()

  const query = useQuery({
    ...(testQueryOptionsHook(config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}