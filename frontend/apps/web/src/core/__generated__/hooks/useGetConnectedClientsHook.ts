import client from "../../frontend/client.ts";
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { GetConnectedClientsQueryResponse } from "../types/GetConnectedClients";
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type GetConnectedClientsClient = typeof client<GetConnectedClientsQueryResponse, Error, never>;
type GetConnectedClients = {
    data: GetConnectedClientsQueryResponse;
    error: Error;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: GetConnectedClientsQueryResponse;
    client: {
        parameters: Partial<Parameters<GetConnectedClientsClient>[0]>;
        return: Awaited<ReturnType<GetConnectedClientsClient>>;
    };
};
export const getConnectedClientsQueryKey = () => [{ url: "/api/Test/connected-clients" }] as const;
export type GetConnectedClientsQueryKey = ReturnType<typeof getConnectedClientsQueryKey>;
export function getConnectedClientsQueryOptions(options: GetConnectedClients["client"]["parameters"] = {}) {
    const queryKey = getConnectedClientsQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetConnectedClients["data"], GetConnectedClients["error"]>({
                method: "get",
                url: `/api/Test/connected-clients`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Test/connected-clients
 */
export function useGetConnectedClientsHook<TData = GetConnectedClients["response"], TQueryData = GetConnectedClients["response"], TQueryKey extends QueryKey = GetConnectedClientsQueryKey>(options: {
    query?: Partial<QueryObserverOptions<GetConnectedClients["response"], GetConnectedClients["error"], TData, TQueryData, TQueryKey>>;
    client?: GetConnectedClients["client"]["parameters"];
} = {}): UseQueryResult<TData, GetConnectedClients["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getConnectedClientsQueryKey();
    const query = useQuery({
        ...getConnectedClientsQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetConnectedClients["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getConnectedClientsInfiniteQueryKey = () => [{ url: "/api/Test/connected-clients" }] as const;
export type GetConnectedClientsInfiniteQueryKey = ReturnType<typeof getConnectedClientsInfiniteQueryKey>;
export function getConnectedClientsInfiniteQueryOptions(options: GetConnectedClients["client"]["parameters"] = {}) {
    const queryKey = getConnectedClientsInfiniteQueryKey();
    return infiniteQueryOptions({
        queryKey,
// @ts-ignore pageParam is declared but its value is possibly never read
        queryFn: async ({ pageParam }) => {
            const res = await client<GetConnectedClients["data"], GetConnectedClients["error"]>({
                method: "get",
                url: `/api/Test/connected-clients`,
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
 * @link /api/Test/connected-clients
 */
export function useGetConnectedClientsHookInfinite<TData = GetConnectedClients["response"], TQueryData = GetConnectedClients["response"], TQueryKey extends QueryKey = GetConnectedClientsInfiniteQueryKey>(options: {
    query?: Partial<InfiniteQueryObserverOptions<GetConnectedClients["response"], GetConnectedClients["error"], TData, TQueryData, TQueryKey>>;
    client?: GetConnectedClients["client"]["parameters"];
} = {}): UseInfiniteQueryResult<TData, GetConnectedClients["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getConnectedClientsInfiniteQueryKey();
    const query = useInfiniteQuery({
        ...getConnectedClientsInfiniteQueryOptions(clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, GetConnectedClients["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getConnectedClientsSuspenseQueryKey = () => [{ url: "/api/Test/connected-clients" }] as const;
export type GetConnectedClientsSuspenseQueryKey = ReturnType<typeof getConnectedClientsSuspenseQueryKey>;
export function getConnectedClientsSuspenseQueryOptions(options: GetConnectedClients["client"]["parameters"] = {}) {
    const queryKey = getConnectedClientsSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetConnectedClients["data"], GetConnectedClients["error"]>({
                method: "get",
                url: `/api/Test/connected-clients`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Test/connected-clients
 */
export function useGetConnectedClientsHookSuspense<TData = GetConnectedClients["response"], TQueryKey extends QueryKey = GetConnectedClientsSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<GetConnectedClients["response"], GetConnectedClients["error"], TData, TQueryKey>>;
    client?: GetConnectedClients["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, GetConnectedClients["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getConnectedClientsSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...getConnectedClientsSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetConnectedClients["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}