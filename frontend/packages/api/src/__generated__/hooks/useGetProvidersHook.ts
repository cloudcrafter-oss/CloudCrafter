import client from '@cloudcrafter/api/client'
import type { GetProvidersQueryResponse, GetProvidersQueryParams } from '../types/GetProviders'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getProviders } from '../axios-backend/getProviders'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getProvidersQueryKey = (params?: GetProvidersQueryParams) => [{ url: '/api/Providers' }, ...(params ? [params] : [])] as const

export type GetProvidersQueryKey = ReturnType<typeof getProvidersQueryKey>

export function getProvidersQueryOptionsHook(params?: GetProvidersQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getProvidersQueryKey(params)
  return queryOptions<GetProvidersQueryResponse, ResponseErrorConfig<Error>, GetProvidersQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getProviders(params, config)
    },
  })
}

/**
 * {@link /api/Providers}
 */
export function useGetProvidersHook<
  TData = GetProvidersQueryResponse,
  TQueryData = GetProvidersQueryResponse,
  TQueryKey extends QueryKey = GetProvidersQueryKey,
>(
  params?: GetProvidersQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<GetProvidersQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getProvidersQueryKey(params)

  const query = useQuery({
    ...(getProvidersQueryOptionsHook(params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}