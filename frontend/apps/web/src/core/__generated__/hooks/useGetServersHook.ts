import client from "../../frontend/client.ts";
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { GetServersQueryResponse } from "../types/GetServers";
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type GetServersClient = typeof client<GetServersQueryResponse, Error, never>;
type GetServers = {
    data: GetServersQueryResponse;
    error: Error;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: GetServersQueryResponse;
    client: {
        parameters: Partial<Parameters<GetServersClient>[0]>;
        return: Awaited<ReturnType<GetServersClient>>;
    };
};
export const getServersQueryKey = () => [{ url: "/api/Servers" }] as const;
export type GetServersQueryKey = ReturnType<typeof getServersQueryKey>;
export function getServersQueryOptions(options: GetServers["client"]["parameters"] = {}) {
    const queryKey = getServersQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetServers["data"], GetServers["error"]>({
                method: "get",
                url: `/api/Servers`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Servers
 */
export function useGetServersHook<TData = GetServers["response"], TQueryData = GetServers["response"], TQueryKey extends QueryKey = GetServersQueryKey>(options: {
    query?: Partial<QueryObserverOptions<GetServers["response"], GetServers["error"], TData, TQueryData, TQueryKey>>;
    client?: GetServers["client"]["parameters"];
} = {}): UseQueryResult<TData, GetServers["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getServersQueryKey();
    const query = useQuery({
        ...getServersQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetServers["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getServersInfiniteQueryKey = () => [{ url: "/api/Servers" }] as const;
export type GetServersInfiniteQueryKey = ReturnType<typeof getServersInfiniteQueryKey>;
export function getServersInfiniteQueryOptions(options: GetServers["client"]["parameters"] = {}) {
    const queryKey = getServersInfiniteQueryKey();
    return infiniteQueryOptions({
        queryKey,
// @ts-ignore pageParam is declared but its value is possibly never read
        queryFn: async ({ pageParam }) => {
            const res = await client<GetServers["data"], GetServers["error"]>({
                method: "get",
                url: `/api/Servers`,
                ...options
            });
            return res.data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}
/**
 * @link /api/Servers
 */
export function useGetServersHookInfinite<TData = GetServers["response"], TQueryData = GetServers["response"], TQueryKey extends QueryKey = GetServersInfiniteQueryKey>(options: {
    query?: Partial<InfiniteQueryObserverOptions<GetServers["response"], GetServers["error"], TData, TQueryData, TQueryKey>>;
    client?: GetServers["client"]["parameters"];
} = {}): UseInfiniteQueryResult<TData, GetServers["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getServersInfiniteQueryKey();
    const query = useInfiniteQuery({
        ...getServersInfiniteQueryOptions(clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, GetServers["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getServersSuspenseQueryKey = () => [{ url: "/api/Servers" }] as const;
export type GetServersSuspenseQueryKey = ReturnType<typeof getServersSuspenseQueryKey>;
export function getServersSuspenseQueryOptions(options: GetServers["client"]["parameters"] = {}) {
    const queryKey = getServersSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetServers["data"], GetServers["error"]>({
                method: "get",
                url: `/api/Servers`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Servers
 */
export function useGetServersHookSuspense<TData = GetServers["response"], TQueryKey extends QueryKey = GetServersSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<GetServers["response"], GetServers["error"], TData, TQueryKey>>;
    client?: GetServers["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, GetServers["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getServersSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...getServersSuspenseQueryOptions(clientOptions) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetServers["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}