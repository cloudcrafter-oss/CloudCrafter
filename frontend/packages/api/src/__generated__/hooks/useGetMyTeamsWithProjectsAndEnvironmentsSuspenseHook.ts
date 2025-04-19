import client from '@cloudcrafter/api/client'
import type { GetMyTeamsWithProjectsAndEnvironmentsQueryResponse } from '../types/GetMyTeamsWithProjectsAndEnvironments'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getMyTeamsWithProjectsAndEnvironments } from '../axios-backend/getMyTeamsWithProjectsAndEnvironments'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getMyTeamsWithProjectsAndEnvironmentsSuspenseQueryKey = () => [{ url: '/api/Teams/projects-and-environments' }] as const

export type GetMyTeamsWithProjectsAndEnvironmentsSuspenseQueryKey = ReturnType<typeof getMyTeamsWithProjectsAndEnvironmentsSuspenseQueryKey>

export function getMyTeamsWithProjectsAndEnvironmentsSuspenseQueryOptionsHook(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getMyTeamsWithProjectsAndEnvironmentsSuspenseQueryKey()
  return queryOptions<
    GetMyTeamsWithProjectsAndEnvironmentsQueryResponse,
    ResponseErrorConfig<Error>,
    GetMyTeamsWithProjectsAndEnvironmentsQueryResponse,
    typeof queryKey
  >({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getMyTeamsWithProjectsAndEnvironments(config)
    },
  })
}

/**
 * {@link /api/Teams/projects-and-environments}
 */
export function useGetMyTeamsWithProjectsAndEnvironmentsSuspenseHook<
  TData = GetMyTeamsWithProjectsAndEnvironmentsQueryResponse,
  TQueryData = GetMyTeamsWithProjectsAndEnvironmentsQueryResponse,
  TQueryKey extends QueryKey = GetMyTeamsWithProjectsAndEnvironmentsSuspenseQueryKey,
>(
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetMyTeamsWithProjectsAndEnvironmentsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getMyTeamsWithProjectsAndEnvironmentsSuspenseQueryKey()

  const query = useSuspenseQuery({
    ...(getMyTeamsWithProjectsAndEnvironmentsSuspenseQueryOptionsHook(config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}