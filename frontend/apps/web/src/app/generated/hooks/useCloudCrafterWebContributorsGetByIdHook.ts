import client from '@kubb/swagger-client/client'
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from '@tanstack/react-query'
import type { CloudCrafterWebContributorsGetByIdQueryResponse, CloudCrafterWebContributorsGetByIdPathParams, CloudCrafterWebContributorsGetById400 } from '../types/CloudCrafterWebContributorsGetById'
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, InfiniteData, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'

 type CloudCrafterWebContributorsGetByIdClient = typeof client<CloudCrafterWebContributorsGetByIdQueryResponse, CloudCrafterWebContributorsGetById400, never>;
type CloudCrafterWebContributorsGetById = {
    data: CloudCrafterWebContributorsGetByIdQueryResponse;
    error: CloudCrafterWebContributorsGetById400;
    request: never;
    pathParams: CloudCrafterWebContributorsGetByIdPathParams;
    queryParams: never;
    headerParams: never;
    response: CloudCrafterWebContributorsGetByIdQueryResponse;
    client: {
        parameters: Partial<Parameters<CloudCrafterWebContributorsGetByIdClient>[0]>;
        return: Awaited<ReturnType<CloudCrafterWebContributorsGetByIdClient>>;
    };
};
export const cloudCrafterWebContributorsGetByIdQueryKey = (contributorId: CloudCrafterWebContributorsGetByIdPathParams['contributorId']) => [{ url: '/Contributors/:contributorId', params: { contributorId: contributorId } }] as const
export type CloudCrafterWebContributorsGetByIdQueryKey = ReturnType<typeof cloudCrafterWebContributorsGetByIdQueryKey>;
export function cloudCrafterWebContributorsGetByIdQueryOptions(contributorId: CloudCrafterWebContributorsGetByIdPathParams['contributorId'], options: CloudCrafterWebContributorsGetById['client']['parameters'] = {}) {
    const queryKey = cloudCrafterWebContributorsGetByIdQueryKey(contributorId)
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<CloudCrafterWebContributorsGetById['data'], CloudCrafterWebContributorsGetById['error']>({
                method: 'get',
                url: `/Contributors/${contributorId}`,
                ...options
            })
            return res.data
        },
    })
}
/**
 * @description Takes a positive integer ID and returns a matching Contributor record.
 * @summary Get a Contributor by integer ID.
 * @link /Contributors/:contributorId
 */
export function useCloudCrafterWebContributorsGetByIdHook<TData = CloudCrafterWebContributorsGetById['response'], TQueryData = CloudCrafterWebContributorsGetById['response'], TQueryKey extends QueryKey = CloudCrafterWebContributorsGetByIdQueryKey>(contributorId: CloudCrafterWebContributorsGetByIdPathParams['contributorId'], options: {
    query?: Partial<QueryObserverOptions<CloudCrafterWebContributorsGetById['response'], CloudCrafterWebContributorsGetById['error'], TData, TQueryData, TQueryKey>>;
    client?: CloudCrafterWebContributorsGetById['client']['parameters'];
} = {}): UseQueryResult<TData, CloudCrafterWebContributorsGetById['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? cloudCrafterWebContributorsGetByIdQueryKey(contributorId)
    const query = useQuery({
        ...cloudCrafterWebContributorsGetByIdQueryOptions(contributorId, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>
    }) as UseQueryResult<TData, CloudCrafterWebContributorsGetById['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}
export const cloudCrafterWebContributorsGetByIdInfiniteQueryKey = (contributorId: CloudCrafterWebContributorsGetByIdPathParams['contributorId']) => [{ url: '/Contributors/:contributorId', params: { contributorId: contributorId } }] as const
export type CloudCrafterWebContributorsGetByIdInfiniteQueryKey = ReturnType<typeof cloudCrafterWebContributorsGetByIdInfiniteQueryKey>;
export function cloudCrafterWebContributorsGetByIdInfiniteQueryOptions(contributorId: CloudCrafterWebContributorsGetByIdPathParams['contributorId'], options: CloudCrafterWebContributorsGetById['client']['parameters'] = {}) {
    const queryKey = cloudCrafterWebContributorsGetByIdInfiniteQueryKey(contributorId)
    return infiniteQueryOptions({
        queryKey,
        queryFn: async ({ pageParam }) => {
            const res = await client<CloudCrafterWebContributorsGetById['data'], CloudCrafterWebContributorsGetById['error']>({
                method: 'get',
                url: `/Contributors/${contributorId}`,
                ...options
            })
            return res.data
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    })
}
/**
 * @description Takes a positive integer ID and returns a matching Contributor record.
 * @summary Get a Contributor by integer ID.
 * @link /Contributors/:contributorId
 */
export function useCloudCrafterWebContributorsGetByIdHookInfinite<TData = InfiniteData<CloudCrafterWebContributorsGetById['response']>, TQueryData = CloudCrafterWebContributorsGetById['response'], TQueryKey extends QueryKey = CloudCrafterWebContributorsGetByIdInfiniteQueryKey>(contributorId: CloudCrafterWebContributorsGetByIdPathParams['contributorId'], options: {
    query?: Partial<InfiniteQueryObserverOptions<CloudCrafterWebContributorsGetById['response'], CloudCrafterWebContributorsGetById['error'], TData, TQueryData, TQueryKey>>;
    client?: CloudCrafterWebContributorsGetById['client']['parameters'];
} = {}): UseInfiniteQueryResult<TData, CloudCrafterWebContributorsGetById['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? cloudCrafterWebContributorsGetByIdInfiniteQueryKey(contributorId)
    const query = useInfiniteQuery({
        ...cloudCrafterWebContributorsGetByIdInfiniteQueryOptions(contributorId, clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>
    }) as UseInfiniteQueryResult<TData, CloudCrafterWebContributorsGetById['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}
export const cloudCrafterWebContributorsGetByIdSuspenseQueryKey = (contributorId: CloudCrafterWebContributorsGetByIdPathParams['contributorId']) => [{ url: '/Contributors/:contributorId', params: { contributorId: contributorId } }] as const
export type CloudCrafterWebContributorsGetByIdSuspenseQueryKey = ReturnType<typeof cloudCrafterWebContributorsGetByIdSuspenseQueryKey>;
export function cloudCrafterWebContributorsGetByIdSuspenseQueryOptions(contributorId: CloudCrafterWebContributorsGetByIdPathParams['contributorId'], options: CloudCrafterWebContributorsGetById['client']['parameters'] = {}) {
    const queryKey = cloudCrafterWebContributorsGetByIdSuspenseQueryKey(contributorId)
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<CloudCrafterWebContributorsGetById['data'], CloudCrafterWebContributorsGetById['error']>({
                method: 'get',
                url: `/Contributors/${contributorId}`,
                ...options
            })
            return res.data
        },
    })
}
/**
 * @description Takes a positive integer ID and returns a matching Contributor record.
 * @summary Get a Contributor by integer ID.
 * @link /Contributors/:contributorId
 */
export function useCloudCrafterWebContributorsGetByIdHookSuspense<TData = CloudCrafterWebContributorsGetById['response'], TQueryKey extends QueryKey = CloudCrafterWebContributorsGetByIdSuspenseQueryKey>(contributorId: CloudCrafterWebContributorsGetByIdPathParams['contributorId'], options: {
    query?: Partial<UseSuspenseQueryOptions<CloudCrafterWebContributorsGetById['response'], CloudCrafterWebContributorsGetById['error'], TData, TQueryKey>>;
    client?: CloudCrafterWebContributorsGetById['client']['parameters'];
} = {}): UseSuspenseQueryResult<TData, CloudCrafterWebContributorsGetById['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? cloudCrafterWebContributorsGetByIdSuspenseQueryKey(contributorId)
    const query = useSuspenseQuery({
        ...cloudCrafterWebContributorsGetByIdSuspenseQueryOptions(contributorId, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>
    }) as UseSuspenseQueryResult<TData, CloudCrafterWebContributorsGetById['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}