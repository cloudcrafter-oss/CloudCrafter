import client from '@cloudcrafter/api/client'
import type { GetStackServiceVolumesQueryResponse, GetStackServiceVolumesPathParams } from '../types/GetStackServiceVolumes'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getStackServiceVolumes } from '../axios-backend/getStackServiceVolumes'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getStackServiceVolumesSuspenseQueryKey = (
  stackId: GetStackServiceVolumesPathParams['stackId'],
  stackServiceId: GetStackServiceVolumesPathParams['stackServiceId'],
) => [{ url: '/api/Stacks/:stackId/services/:stackServiceId/volumes', params: { stackId: stackId, stackServiceId: stackServiceId } }] as const

export type GetStackServiceVolumesSuspenseQueryKey = ReturnType<typeof getStackServiceVolumesSuspenseQueryKey>

export function getStackServiceVolumesSuspenseQueryOptionsHook(
  stackId: GetStackServiceVolumesPathParams['stackId'],
  stackServiceId: GetStackServiceVolumesPathParams['stackServiceId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getStackServiceVolumesSuspenseQueryKey(stackId, stackServiceId)
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
export function useGetStackServiceVolumesSuspenseHook<
  TData = GetStackServiceVolumesQueryResponse,
  TQueryData = GetStackServiceVolumesQueryResponse,
  TQueryKey extends QueryKey = GetStackServiceVolumesSuspenseQueryKey,
>(
  stackId: GetStackServiceVolumesPathParams['stackId'],
  stackServiceId: GetStackServiceVolumesPathParams['stackServiceId'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetStackServiceVolumesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getStackServiceVolumesSuspenseQueryKey(stackId, stackServiceId)

  const query = useSuspenseQuery({
    ...(getStackServiceVolumesSuspenseQueryOptionsHook(stackId, stackServiceId, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}