import client from '@cloudcrafter/api/client'
import type { GetStackServiceVolumesQueryResponse, GetStackServiceVolumesPathParams } from '../types/GetStackServiceVolumes'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getStackServiceVolumes } from '../axios-backend/getStackServiceVolumes'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getStackServiceVolumesQueryKey = (
  stackId: GetStackServiceVolumesPathParams['stackId'],
  stackServiceId: GetStackServiceVolumesPathParams['stackServiceId'],
) => [{ url: '/api/Stacks/:stackId/services/:stackServiceId/volumes', params: { stackId: stackId, stackServiceId: stackServiceId } }] as const

export type GetStackServiceVolumesQueryKey = ReturnType<typeof getStackServiceVolumesQueryKey>

export function getStackServiceVolumesQueryOptionsHook(
  stackId: GetStackServiceVolumesPathParams['stackId'],
  stackServiceId: GetStackServiceVolumesPathParams['stackServiceId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getStackServiceVolumesQueryKey(stackId, stackServiceId)
  return queryOptions<GetStackServiceVolumesQueryResponse, ResponseErrorConfig<Error>, GetStackServiceVolumesQueryResponse, typeof queryKey>({
    enabled: !!(stackId && stackServiceId),
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getStackServiceVolumes(stackId, stackServiceId, config)
    },
  })
}

/**
 * {@link /api/Stacks/:stackId/services/:stackServiceId/volumes}
 */
export function useGetStackServiceVolumesHook<
  TData = GetStackServiceVolumesQueryResponse,
  TQueryData = GetStackServiceVolumesQueryResponse,
  TQueryKey extends QueryKey = GetStackServiceVolumesQueryKey,
>(
  stackId: GetStackServiceVolumesPathParams['stackId'],
  stackServiceId: GetStackServiceVolumesPathParams['stackServiceId'],
  options: {
    query?: Partial<QueryObserverOptions<GetStackServiceVolumesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getStackServiceVolumesQueryKey(stackId, stackServiceId)

  const query = useQuery({
    ...(getStackServiceVolumesQueryOptionsHook(stackId, stackServiceId, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}