import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { GetProjectsQueryResponse, GetProjectsQueryParams } from '../types/GetProjects'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getProjects } from '../axios-backend/getProjects'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getProjectsSuspenseQueryKey = (params?: GetProjectsQueryParams) => [{ url: '/api/Projects' }, ...(params ? [params] : [])] as const

export type GetProjectsSuspenseQueryKey = ReturnType<typeof getProjectsSuspenseQueryKey>

export function getProjectsSuspenseQueryOptionsHook(params?: GetProjectsQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getProjectsSuspenseQueryKey(params)
  return queryOptions<GetProjectsQueryResponse, ResponseErrorConfig<Error>, GetProjectsQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getProjects(params, config)
    },
  })
}

/**
 * {@link /api/Projects}
 */
export function useGetProjectsSuspenseHook<
  TData = GetProjectsQueryResponse,
  TQueryData = GetProjectsQueryResponse,
  TQueryKey extends QueryKey = GetProjectsSuspenseQueryKey,
>(
  params?: GetProjectsQueryParams,
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetProjectsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getProjectsSuspenseQueryKey(params)

  const query = useSuspenseQuery({
    ...(getProjectsSuspenseQueryOptionsHook(params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}