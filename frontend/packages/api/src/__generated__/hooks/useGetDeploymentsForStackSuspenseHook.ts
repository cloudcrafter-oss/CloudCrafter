import client from '@cloudcrafter/api/client'
import type { GetDeploymentsForStackQueryResponse, GetDeploymentsForStackPathParams } from '../types/GetDeploymentsForStack'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getDeploymentsForStack } from '../axios-backend/getDeploymentsForStack'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getDeploymentsForStackSuspenseQueryKey = (id: GetDeploymentsForStackPathParams['id']) =>
  [{ url: '/api/Stacks/:id/deployments', params: { id: id } }] as const

export type GetDeploymentsForStackSuspenseQueryKey = ReturnType<typeof getDeploymentsForStackSuspenseQueryKey>

export function getDeploymentsForStackSuspenseQueryOptionsHook(
  id: GetDeploymentsForStackPathParams['id'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getDeploymentsForStackSuspenseQueryKey(id)
  return queryOptions<GetDeploymentsForStackQueryResponse, ResponseErrorConfig<Error>, GetDeploymentsForStackQueryResponse, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getDeploymentsForStack(id, config)
    },
  })
}

/**
 * {@link /api/Stacks/:id/deployments}
 */
export function useGetDeploymentsForStackSuspenseHook<
  TData = GetDeploymentsForStackQueryResponse,
  TQueryData = GetDeploymentsForStackQueryResponse,
  TQueryKey extends QueryKey = GetDeploymentsForStackSuspenseQueryKey,
>(
  id: GetDeploymentsForStackPathParams['id'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetDeploymentsForStackQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDeploymentsForStackSuspenseQueryKey(id)

  const query = useSuspenseQuery({
    ...(getDeploymentsForStackSuspenseQueryOptionsHook(id, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}