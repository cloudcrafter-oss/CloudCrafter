import client from '@kubb/swagger-client/client'
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from '@tanstack/react-query'
import type { GetUsersQueryResponse, GetUsersQueryParams } from '../types/GetUsers'
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, InfiniteData, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'

 type GetUsersClient = typeof client<GetUsersQueryResponse, never, never>;
type GetUsers = {
    data: GetUsersQueryResponse;
    error: never;
    request: never;
    pathParams: never;
    queryParams: GetUsersQueryParams;
    headerParams: never;
    response: GetUsersQueryResponse;
    client: {
        parameters: Partial<Parameters<GetUsersClient>[0]>;
        return: Awaited<ReturnType<GetUsersClient>>;
    };
};
export const getUsersQueryKey = (params?: GetUsers['queryParams']) => [{ url: '/api/Users' }, ...(params ? [params] : [])] as const
export type GetUsersQueryKey = ReturnType<typeof getUsersQueryKey>;
export function getUsersQueryOptions(params?: GetUsers['queryParams'], options: GetUsers['client']['parameters'] = {}) {
    const queryKey = getUsersQueryKey(params)
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetUsers['data'], GetUsers['error']>({
                method: 'get',
                url: '/api/Users',
                params,
                ...options
            })
            return res.data
        },
    })
}
/**
 * @link /api/Users
 */
export function useGetUsersHook<TData = GetUsers['response'], TQueryData = GetUsers['response'], TQueryKey extends QueryKey = GetUsersQueryKey>(params?: GetUsers['queryParams'], options: {
    query?: Partial<QueryObserverOptions<GetUsers['response'], GetUsers['error'], TData, TQueryData, TQueryKey>>;
    client?: GetUsers['client']['parameters'];
} = {}): UseQueryResult<TData, GetUsers['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? getUsersQueryKey(params)
    const query = useQuery({
        ...getUsersQueryOptions(params, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>
    }) as UseQueryResult<TData, GetUsers['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}
export const getUsersInfiniteQueryKey = (params?: GetUsers['queryParams']) => [{ url: '/api/Users' }, ...(params ? [params] : [])] as const
export type GetUsersInfiniteQueryKey = ReturnType<typeof getUsersInfiniteQueryKey>;
export function getUsersInfiniteQueryOptions(params?: GetUsers['queryParams'], options: GetUsers['client']['parameters'] = {}) {
    const queryKey = getUsersInfiniteQueryKey(params)
    return infiniteQueryOptions({
        queryKey,
// @ts-expect-error TS6133: pageParam is declared but its value is never read
        queryFn: async ({ pageParam }) => {
            const res = await client<GetUsers['data'], GetUsers['error']>({
                method: 'get',
                url: '/api/Users',
                ...options,
                params: {
                    ...params,
                    ['id']: pageParam,
                    ...(options.params || {}),
                }
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
export function useGetUsersHookInfinite<TData = InfiniteData<GetUsers['response']>, TQueryData = GetUsers['response'], TQueryKey extends QueryKey = GetUsersInfiniteQueryKey>(params?: GetUsers['queryParams'], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetUsers['response'], GetUsers['error'], TData, TQueryData, TQueryKey>>;
    client?: GetUsers['client']['parameters'];
} = {}): UseInfiniteQueryResult<TData, GetUsers['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? getUsersInfiniteQueryKey(params)
    const query = useInfiniteQuery({
        ...getUsersInfiniteQueryOptions(params, clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>
    }) as UseInfiniteQueryResult<TData, GetUsers['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}
export const getUsersSuspenseQueryKey = (params?: GetUsers['queryParams']) => [{ url: '/api/Users' }, ...(params ? [params] : [])] as const
export type GetUsersSuspenseQueryKey = ReturnType<typeof getUsersSuspenseQueryKey>;
export function getUsersSuspenseQueryOptions(params?: GetUsers['queryParams'], options: GetUsers['client']['parameters'] = {}) {
    const queryKey = getUsersSuspenseQueryKey(params)
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetUsers['data'], GetUsers['error']>({
                method: 'get',
                url: '/api/Users',
                params,
                ...options
            })
            return res.data
        },
    })
}
/**
 * @link /api/Users
 */
export function useGetUsersHookSuspense<TData = GetUsers['response'], TQueryKey extends QueryKey = GetUsersSuspenseQueryKey>(params?: GetUsers['queryParams'], options: {
    query?: Partial<UseSuspenseQueryOptions<GetUsers['response'], GetUsers['error'], TData, TQueryKey>>;
    client?: GetUsers['client']['parameters'];
} = {}): UseSuspenseQueryResult<TData, GetUsers['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? getUsersSuspenseQueryKey(params)
    const query = useSuspenseQuery({
        ...getUsersSuspenseQueryOptions(params, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>
    }) as UseSuspenseQueryResult<TData, GetUsers['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}