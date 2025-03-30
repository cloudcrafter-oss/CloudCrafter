import client from '@cloudcrafter/api/client'
import type { GetDeploymentsForStackQueryResponse, GetDeploymentsForStackPathParams } from '../types/GetDeploymentsForStack'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getDeploymentsForStack } from '../axios-backend/getDeploymentsForStack'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getDeploymentsForStackQueryKey = (id: GetDeploymentsForStackPathParams['id']) =>
  [{ url: '/api/Stacks/:id/deployments', params: { id: id } }] as const

export type GetDeploymentsForStackQueryKey = ReturnType<typeof getDeploymentsForStackQueryKey>

export function getDeploymentsForStackQueryOptionsHook(
  id: GetDeploymentsForStackPathParams['id'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getDeploymentsForStackQueryKey(id)
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
export function useGetDeploymentsForStackHook<
  TData = GetDeploymentsForStackQueryResponse,
  TQueryData = GetDeploymentsForStackQueryResponse,
  TQueryKey extends QueryKey = GetDeploymentsForStackQueryKey,
>(
  id: GetDeploymentsForStackPathParams['id'],
  options: {
    query?: Partial<QueryObserverOptions<GetDeploymentsForStackQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDeploymentsForStackQueryKey(id)

  const query = useQuery({
    ...(getDeploymentsForStackQueryOptionsHook(id, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}