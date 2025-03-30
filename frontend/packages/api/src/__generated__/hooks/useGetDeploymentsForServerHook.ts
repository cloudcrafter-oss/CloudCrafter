import client from '@cloudcrafter/api/client'
import type {
  GetDeploymentsForServerQueryResponse,
  GetDeploymentsForServerPathParams,
  GetDeploymentsForServerQueryParams,
} from '../types/GetDeploymentsForServer'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getDeploymentsForServer } from '../axios-backend/getDeploymentsForServer'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getDeploymentsForServerQueryKey = (id: GetDeploymentsForServerPathParams['id'], params?: GetDeploymentsForServerQueryParams) =>
  [{ url: '/api/Servers/:id/deployments', params: { id: id } }, ...(params ? [params] : [])] as const

export type GetDeploymentsForServerQueryKey = ReturnType<typeof getDeploymentsForServerQueryKey>

export function getDeploymentsForServerQueryOptionsHook(
  id: GetDeploymentsForServerPathParams['id'],
  params?: GetDeploymentsForServerQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getDeploymentsForServerQueryKey(id, params)
  return queryOptions<GetDeploymentsForServerQueryResponse, ResponseErrorConfig<Error>, GetDeploymentsForServerQueryResponse, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getDeploymentsForServer(id, params, config)
    },
  })
}

/**
 * {@link /api/Servers/:id/deployments}
 */
export function useGetDeploymentsForServerHook<
  TData = GetDeploymentsForServerQueryResponse,
  TQueryData = GetDeploymentsForServerQueryResponse,
  TQueryKey extends QueryKey = GetDeploymentsForServerQueryKey,
>(
  id: GetDeploymentsForServerPathParams['id'],
  params?: GetDeploymentsForServerQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<GetDeploymentsForServerQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDeploymentsForServerQueryKey(id, params)

  const query = useQuery({
    ...(getDeploymentsForServerQueryOptionsHook(id, params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}