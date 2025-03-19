import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type {
  GetDeploymentsForServerQueryResponse,
  GetDeploymentsForServerPathParams,
  GetDeploymentsForServerQueryParams,
} from '../types/GetDeploymentsForServer'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getDeploymentsForServer } from '../axios-backend/getDeploymentsForServer'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getDeploymentsForServerSuspenseQueryKey = (id: GetDeploymentsForServerPathParams['id'], params?: GetDeploymentsForServerQueryParams) =>
  [{ url: '/api/Servers/:id/deployments', params: { id: id } }, ...(params ? [params] : [])] as const

export type GetDeploymentsForServerSuspenseQueryKey = ReturnType<typeof getDeploymentsForServerSuspenseQueryKey>

export function getDeploymentsForServerSuspenseQueryOptionsHook(
  id: GetDeploymentsForServerPathParams['id'],
  params?: GetDeploymentsForServerQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getDeploymentsForServerSuspenseQueryKey(id, params)
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
export function useGetDeploymentsForServerSuspenseHook<
  TData = GetDeploymentsForServerQueryResponse,
  TQueryData = GetDeploymentsForServerQueryResponse,
  TQueryKey extends QueryKey = GetDeploymentsForServerSuspenseQueryKey,
>(
  id: GetDeploymentsForServerPathParams['id'],
  params?: GetDeploymentsForServerQueryParams,
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetDeploymentsForServerQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDeploymentsForServerSuspenseQueryKey(id, params)

  const query = useSuspenseQuery({
    ...(getDeploymentsForServerSuspenseQueryOptionsHook(id, params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}