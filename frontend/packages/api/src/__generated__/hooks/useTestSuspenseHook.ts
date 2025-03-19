import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { TestQueryResponse } from '../types/Test'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { test } from '../axios-backend/test'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const testSuspenseQueryKey = () => [{ url: '/api/Users/test' }] as const

export type TestSuspenseQueryKey = ReturnType<typeof testSuspenseQueryKey>

export function testSuspenseQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = testSuspenseQueryKey()
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
export function useTestSuspenseHook<TData = TestQueryResponse, TQueryData = TestQueryResponse, TQueryKey extends QueryKey = TestSuspenseQueryKey>(
  options: {
    query?: Partial<UseSuspenseQueryOptions<TestQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? testSuspenseQueryKey()

  const query = useSuspenseQuery({
    ...(testSuspenseQueryOptionsHook(config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}