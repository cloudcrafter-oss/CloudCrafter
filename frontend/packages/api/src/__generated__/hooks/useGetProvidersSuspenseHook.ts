import client from '@cloudcrafter/api/client'
import type { GetProvidersQueryResponse, GetProvidersQueryParams } from '../types/GetProviders'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getProviders } from '../axios-backend/getProviders'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getProvidersSuspenseQueryKey = (params?: GetProvidersQueryParams) => [{ url: '/api/Providers' }, ...(params ? [params] : [])] as const

export type GetProvidersSuspenseQueryKey = ReturnType<typeof getProvidersSuspenseQueryKey>

export function getProvidersSuspenseQueryOptionsHook(params?: GetProvidersQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getProvidersSuspenseQueryKey(params)
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
export function useGetProvidersSuspenseHook<
  TData = GetProvidersQueryResponse,
  TQueryData = GetProvidersQueryResponse,
  TQueryKey extends QueryKey = GetProvidersSuspenseQueryKey,
>(
  params?: GetProvidersQueryParams,
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetProvidersQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getProvidersSuspenseQueryKey(params)

  const query = useSuspenseQuery({
    ...(getProvidersSuspenseQueryOptionsHook(params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}