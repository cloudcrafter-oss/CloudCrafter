import client from '@kubb/swagger-client/client'
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from '@tanstack/react-query'
import type { GetUsersQueryResponse } from '../types/GetUsers'
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, InfiniteData, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'

 type GetUsersClient = typeof client<GetUsersQueryResponse, never, never>;
type GetUsers = {
    data: GetUsersQueryResponse;
    error: never;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: GetUsersQueryResponse;
    client: {
        parameters: Partial<Parameters<GetUsersClient>[0]>;
        return: Awaited<ReturnType<GetUsersClient>>;
    };
};
export const getUsersQueryKey = () => [{ url: '/api/Users' }] as const
export type GetUsersQueryKey = ReturnType<typeof getUsersQueryKey>;
export function getUsersQueryOptions(options: GetUsers['client']['parameters'] = {}) {
    const queryKey = getUsersQueryKey()
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetUsers['data'], GetUsers['error']>({
                method: 'get',
                url: '/api/Users',
                ...options
            })
            return res.data
        },
    })
}
/**
 * @link /api/Users
 */
export function useGetUsersHook<TData = GetUsers['response'], TQueryData = GetUsers['response'], TQueryKey extends QueryKey = GetUsersQueryKey>(options: {
    query?: Partial<QueryObserverOptions<GetUsers['response'], GetUsers['error'], TData, TQueryData, TQueryKey>>;
    client?: GetUsers['client']['parameters'];
} = {}): UseQueryResult<TData, GetUsers['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? getUsersQueryKey()
    const query = useQuery({
        ...getUsersQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>
    }) as UseQueryResult<TData, GetUsers['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}
export const getUsersInfiniteQueryKey = () => [{ url: '/api/Users' }] as const
export type GetUsersInfiniteQueryKey = ReturnType<typeof getUsersInfiniteQueryKey>;
export function getUsersInfiniteQueryOptions(options: GetUsers['client']['parameters'] = {}) {
    const queryKey = getUsersInfiniteQueryKey()
    return infiniteQueryOptions({
        queryKey,
// @ts-expect-error TS6133: pageParam is declared but its value is never read
        queryFn: async ({ pageParam }) => {
            const res = await client<GetUsers['data'], GetUsers['error']>({
                method: 'get',
                url: '/api/Users',
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
 * @link /api/Users
 */
export function useGetUsersHookInfinite<TData = InfiniteData<GetUsers['response']>, TQueryData = GetUsers['response'], TQueryKey extends QueryKey = GetUsersInfiniteQueryKey>(options: {
    query?: Partial<InfiniteQueryObserverOptions<GetUsers['response'], GetUsers['error'], TData, TQueryData, TQueryKey>>;
    client?: GetUsers['client']['parameters'];
} = {}): UseInfiniteQueryResult<TData, GetUsers['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? getUsersInfiniteQueryKey()
    const query = useInfiniteQuery({
        ...getUsersInfiniteQueryOptions(clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>
    }) as UseInfiniteQueryResult<TData, GetUsers['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}
export const getUsersSuspenseQueryKey = () => [{ url: '/api/Users' }] as const
export type GetUsersSuspenseQueryKey = ReturnType<typeof getUsersSuspenseQueryKey>;
export function getUsersSuspenseQueryOptions(options: GetUsers['client']['parameters'] = {}) {
    const queryKey = getUsersSuspenseQueryKey()
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetUsers['data'], GetUsers['error']>({
                method: 'get',
                url: '/api/Users',
                ...options
            })
            return res.data
        },
    })
}
/**
 * @link /api/Users
 */
export function useGetUsersHookSuspense<TData = GetUsers['response'], TQueryKey extends QueryKey = GetUsersSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<GetUsers['response'], GetUsers['error'], TData, TQueryKey>>;
    client?: GetUsers['client']['parameters'];
} = {}): UseSuspenseQueryResult<TData, GetUsers['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? getUsersSuspenseQueryKey()
    const query = useSuspenseQuery({
        ...getUsersSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>
    }) as UseSuspenseQueryResult<TData, GetUsers['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}