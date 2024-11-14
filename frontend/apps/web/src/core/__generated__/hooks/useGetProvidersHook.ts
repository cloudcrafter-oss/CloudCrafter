import client from "../../frontend/client.ts";
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { GetProvidersQueryResponse } from "../types/GetProviders";
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type GetProvidersClient = typeof client<GetProvidersQueryResponse, Error, never>;
type GetProviders = {
    data: GetProvidersQueryResponse;
    error: Error;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: GetProvidersQueryResponse;
    client: {
        parameters: Partial<Parameters<GetProvidersClient>[0]>;
        return: Awaited<ReturnType<GetProvidersClient>>;
    };
};
export const getProvidersQueryKey = () => [{ url: "/api/Providers" }] as const;
export type GetProvidersQueryKey = ReturnType<typeof getProvidersQueryKey>;
export function getProvidersQueryOptions(options: GetProviders["client"]["parameters"] = {}) {
    const queryKey = getProvidersQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetProviders["data"], GetProviders["error"]>({
                method: "get",
                url: `/api/Providers`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Providers
 */
export function useGetProvidersHook<TData = GetProviders["response"], TQueryData = GetProviders["response"], TQueryKey extends QueryKey = GetProvidersQueryKey>(options: {
    query?: Partial<QueryObserverOptions<GetProviders["response"], GetProviders["error"], TData, TQueryData, TQueryKey>>;
    client?: GetProviders["client"]["parameters"];
} = {}): UseQueryResult<TData, GetProviders["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProvidersQueryKey();
    const query = useQuery({
        ...getProvidersQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetProviders["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getProvidersInfiniteQueryKey = () => [{ url: "/api/Providers" }] as const;
export type GetProvidersInfiniteQueryKey = ReturnType<typeof getProvidersInfiniteQueryKey>;
export function getProvidersInfiniteQueryOptions(options: GetProviders["client"]["parameters"] = {}) {
    const queryKey = getProvidersInfiniteQueryKey();
    return infiniteQueryOptions({
        queryKey,
// @ts-ignore pageParam is declared but its value is possibly never read
        queryFn: async ({ pageParam }) => {
            const res = await client<GetProviders["data"], GetProviders["error"]>({
                method: "get",
                url: `/api/Providers`,
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
 * @link /api/Providers
 */
export function useGetProvidersHookInfinite<TData = GetProviders["response"], TQueryData = GetProviders["response"], TQueryKey extends QueryKey = GetProvidersInfiniteQueryKey>(options: {
    query?: Partial<InfiniteQueryObserverOptions<GetProviders["response"], GetProviders["error"], TData, TQueryData, TQueryKey>>;
    client?: GetProviders["client"]["parameters"];
} = {}): UseInfiniteQueryResult<TData, GetProviders["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProvidersInfiniteQueryKey();
    const query = useInfiniteQuery({
        ...getProvidersInfiniteQueryOptions(clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, GetProviders["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getProvidersSuspenseQueryKey = () => [{ url: "/api/Providers" }] as const;
export type GetProvidersSuspenseQueryKey = ReturnType<typeof getProvidersSuspenseQueryKey>;
export function getProvidersSuspenseQueryOptions(options: GetProviders["client"]["parameters"] = {}) {
    const queryKey = getProvidersSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetProviders["data"], GetProviders["error"]>({
                method: "get",
                url: `/api/Providers`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Providers
 */
export function useGetProvidersHookSuspense<TData = GetProviders["response"], TQueryKey extends QueryKey = GetProvidersSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<GetProviders["response"], GetProviders["error"], TData, TQueryKey>>;
    client?: GetProviders["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, GetProviders["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProvidersSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...getProvidersSuspenseQueryOptions(clientOptions) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetProviders["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}