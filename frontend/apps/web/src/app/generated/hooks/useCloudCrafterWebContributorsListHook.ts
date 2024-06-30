import client from '@kubb/swagger-client/client'
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from '@tanstack/react-query'
import type { CloudCrafterWebContributorsListQueryResponse } from '../types/CloudCrafterWebContributorsList'
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, InfiniteData, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'

 type CloudCrafterWebContributorsListClient = typeof client<CloudCrafterWebContributorsListQueryResponse, never, never>;
type CloudCrafterWebContributorsList = {
    data: CloudCrafterWebContributorsListQueryResponse;
    error: never;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: CloudCrafterWebContributorsListQueryResponse;
    client: {
        parameters: Partial<Parameters<CloudCrafterWebContributorsListClient>[0]>;
        return: Awaited<ReturnType<CloudCrafterWebContributorsListClient>>;
    };
};
export const cloudCrafterWebContributorsListQueryKey = () => [{ url: '/Contributors' }] as const
export type CloudCrafterWebContributorsListQueryKey = ReturnType<typeof cloudCrafterWebContributorsListQueryKey>;
export function cloudCrafterWebContributorsListQueryOptions(options: CloudCrafterWebContributorsList['client']['parameters'] = {}) {
    const queryKey = cloudCrafterWebContributorsListQueryKey()
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<CloudCrafterWebContributorsList['data'], CloudCrafterWebContributorsList['error']>({
                method: 'get',
                url: '/Contributors',
                ...options
            })
            return res.data
        },
    })
}
/**
 * @description List all contributors - returns a ContributorListResponse containing the Contributors.
 * @summary List all Contributors
 * @link /Contributors
 */
export function useCloudCrafterWebContributorsListHook<TData = CloudCrafterWebContributorsList['response'], TQueryData = CloudCrafterWebContributorsList['response'], TQueryKey extends QueryKey = CloudCrafterWebContributorsListQueryKey>(options: {
    query?: Partial<QueryObserverOptions<CloudCrafterWebContributorsList['response'], CloudCrafterWebContributorsList['error'], TData, TQueryData, TQueryKey>>;
    client?: CloudCrafterWebContributorsList['client']['parameters'];
} = {}): UseQueryResult<TData, CloudCrafterWebContributorsList['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? cloudCrafterWebContributorsListQueryKey()
    const query = useQuery({
        ...cloudCrafterWebContributorsListQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>
    }) as UseQueryResult<TData, CloudCrafterWebContributorsList['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}
export const cloudCrafterWebContributorsListInfiniteQueryKey = () => [{ url: '/Contributors' }] as const
export type CloudCrafterWebContributorsListInfiniteQueryKey = ReturnType<typeof cloudCrafterWebContributorsListInfiniteQueryKey>;
export function cloudCrafterWebContributorsListInfiniteQueryOptions(options: CloudCrafterWebContributorsList['client']['parameters'] = {}) {
    const queryKey = cloudCrafterWebContributorsListInfiniteQueryKey()
    return infiniteQueryOptions({
        queryKey,
// @ts-expect-error TS6133: pageParam is declared but its value is never read
        queryFn: async ({ pageParam }) => {
            const res = await client<CloudCrafterWebContributorsList['data'], CloudCrafterWebContributorsList['error']>({
                method: 'get',
                url: '/Contributors',
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
 * @description List all contributors - returns a ContributorListResponse containing the Contributors.
 * @summary List all Contributors
 * @link /Contributors
 */
export function useCloudCrafterWebContributorsListHookInfinite<TData = InfiniteData<CloudCrafterWebContributorsList['response']>, TQueryData = CloudCrafterWebContributorsList['response'], TQueryKey extends QueryKey = CloudCrafterWebContributorsListInfiniteQueryKey>(options: {
    query?: Partial<InfiniteQueryObserverOptions<CloudCrafterWebContributorsList['response'], CloudCrafterWebContributorsList['error'], TData, TQueryData, TQueryKey>>;
    client?: CloudCrafterWebContributorsList['client']['parameters'];
} = {}): UseInfiniteQueryResult<TData, CloudCrafterWebContributorsList['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? cloudCrafterWebContributorsListInfiniteQueryKey()
    const query = useInfiniteQuery({
        ...cloudCrafterWebContributorsListInfiniteQueryOptions(clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>
    }) as UseInfiniteQueryResult<TData, CloudCrafterWebContributorsList['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}
export const cloudCrafterWebContributorsListSuspenseQueryKey = () => [{ url: '/Contributors' }] as const
export type CloudCrafterWebContributorsListSuspenseQueryKey = ReturnType<typeof cloudCrafterWebContributorsListSuspenseQueryKey>;
export function cloudCrafterWebContributorsListSuspenseQueryOptions(options: CloudCrafterWebContributorsList['client']['parameters'] = {}) {
    const queryKey = cloudCrafterWebContributorsListSuspenseQueryKey()
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<CloudCrafterWebContributorsList['data'], CloudCrafterWebContributorsList['error']>({
                method: 'get',
                url: '/Contributors',
                ...options
            })
            return res.data
        },
    })
}
/**
 * @description List all contributors - returns a ContributorListResponse containing the Contributors.
 * @summary List all Contributors
 * @link /Contributors
 */
export function useCloudCrafterWebContributorsListHookSuspense<TData = CloudCrafterWebContributorsList['response'], TQueryKey extends QueryKey = CloudCrafterWebContributorsListSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<CloudCrafterWebContributorsList['response'], CloudCrafterWebContributorsList['error'], TData, TQueryKey>>;
    client?: CloudCrafterWebContributorsList['client']['parameters'];
} = {}): UseSuspenseQueryResult<TData, CloudCrafterWebContributorsList['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? cloudCrafterWebContributorsListSuspenseQueryKey()
    const query = useSuspenseQuery({
        ...cloudCrafterWebContributorsListSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>
    }) as UseSuspenseQueryResult<TData, CloudCrafterWebContributorsList['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}