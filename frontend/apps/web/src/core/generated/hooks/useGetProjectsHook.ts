import client from '@kubb/swagger-client/client'
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from '@tanstack/react-query'
import type { GetProjectsQueryResponse } from '../types/GetProjects'
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, InfiniteData, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'

 type GetProjectsClient = typeof client<GetProjectsQueryResponse, never, never>;
type GetProjects = {
    data: GetProjectsQueryResponse;
    error: never;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: GetProjectsQueryResponse;
    client: {
        parameters: Partial<Parameters<GetProjectsClient>[0]>;
        return: Awaited<ReturnType<GetProjectsClient>>;
    };
};
export const getProjectsQueryKey = () => [{ url: '/api/Projects' }] as const
export type GetProjectsQueryKey = ReturnType<typeof getProjectsQueryKey>;
export function getProjectsQueryOptions(options: GetProjects['client']['parameters'] = {}) {
    const queryKey = getProjectsQueryKey()
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetProjects['data'], GetProjects['error']>({
                method: 'get',
                url: '/api/Projects',
                ...options
            })
            return res.data
        },
    })
}
/**
 * @link /api/Projects
 */
export function useGetProjectsHook<TData = GetProjects['response'], TQueryData = GetProjects['response'], TQueryKey extends QueryKey = GetProjectsQueryKey>(options: {
    query?: Partial<QueryObserverOptions<GetProjects['response'], GetProjects['error'], TData, TQueryData, TQueryKey>>;
    client?: GetProjects['client']['parameters'];
} = {}): UseQueryResult<TData, GetProjects['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? getProjectsQueryKey()
    const query = useQuery({
        ...getProjectsQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>
    }) as UseQueryResult<TData, GetProjects['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}
export const getProjectsInfiniteQueryKey = () => [{ url: '/api/Projects' }] as const
export type GetProjectsInfiniteQueryKey = ReturnType<typeof getProjectsInfiniteQueryKey>;
export function getProjectsInfiniteQueryOptions(options: GetProjects['client']['parameters'] = {}) {
    const queryKey = getProjectsInfiniteQueryKey()
    return infiniteQueryOptions({
        queryKey,
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore pageParam is declared but its value is possibly never read
        queryFn: async ({ pageParam }) => {
            const res = await client<GetProjects['data'], GetProjects['error']>({
                method: 'get',
                url: '/api/Projects',
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
 * @link /api/Projects
 */
export function useGetProjectsHookInfinite<TData = InfiniteData<GetProjects['response']>, TQueryData = GetProjects['response'], TQueryKey extends QueryKey = GetProjectsInfiniteQueryKey>(options: {
    query?: Partial<InfiniteQueryObserverOptions<GetProjects['response'], GetProjects['error'], TData, TQueryData, TQueryKey>>;
    client?: GetProjects['client']['parameters'];
} = {}): UseInfiniteQueryResult<TData, GetProjects['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? getProjectsInfiniteQueryKey()
    const query = useInfiniteQuery({
        ...getProjectsInfiniteQueryOptions(clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>
    }) as UseInfiniteQueryResult<TData, GetProjects['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}
export const getProjectsSuspenseQueryKey = () => [{ url: '/api/Projects' }] as const
export type GetProjectsSuspenseQueryKey = ReturnType<typeof getProjectsSuspenseQueryKey>;
export function getProjectsSuspenseQueryOptions(options: GetProjects['client']['parameters'] = {}) {
    const queryKey = getProjectsSuspenseQueryKey()
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetProjects['data'], GetProjects['error']>({
                method: 'get',
                url: '/api/Projects',
                ...options
            })
            return res.data
        },
    })
}
/**
 * @link /api/Projects
 */
export function useGetProjectsHookSuspense<TData = GetProjects['response'], TQueryKey extends QueryKey = GetProjectsSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<GetProjects['response'], GetProjects['error'], TData, TQueryKey>>;
    client?: GetProjects['client']['parameters'];
} = {}): UseSuspenseQueryResult<TData, GetProjects['error']> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {}
    const queryKey = queryOptions?.queryKey ?? getProjectsSuspenseQueryKey()
    const query = useSuspenseQuery({
        ...getProjectsSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>
    }) as UseSuspenseQueryResult<TData, GetProjects['error']> & {
        queryKey: TQueryKey;
    }
    query.queryKey = queryKey as TQueryKey
    return query
}