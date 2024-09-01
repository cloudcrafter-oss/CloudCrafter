import client from "../../frontend/client.ts";
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { GetServerByIdQueryResponse, GetServerByIdPathParams } from "../types/GetServerById";
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, InfiniteData, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type GetServerByIdClient = typeof client<GetServerByIdQueryResponse, never, never>;
type GetServerById = {
    data: GetServerByIdQueryResponse;
    error: never;
    request: never;
    pathParams: GetServerByIdPathParams;
    queryParams: never;
    headerParams: never;
    response: GetServerByIdQueryResponse;
    client: {
        parameters: Partial<Parameters<GetServerByIdClient>[0]>;
        return: Awaited<ReturnType<GetServerByIdClient>>;
    };
};
export const getServerByIdQueryKey = (id: GetServerByIdPathParams["id"]) => [{ url: "/api/Servers/:id", params: { id: id } }] as const;
export type GetServerByIdQueryKey = ReturnType<typeof getServerByIdQueryKey>;
export function getServerByIdQueryOptions(id: GetServerByIdPathParams["id"], options: GetServerById["client"]["parameters"] = {}) {
    const queryKey = getServerByIdQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetServerById["data"], GetServerById["error"]>({
                method: "get",
                url: `/api/Servers/${id}`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Servers/:id
 */
export function useGetServerByIdHook<TData = GetServerById["response"], TQueryData = GetServerById["response"], TQueryKey extends QueryKey = GetServerByIdQueryKey>(id: GetServerByIdPathParams["id"], options: {
    query?: Partial<QueryObserverOptions<GetServerById["response"], GetServerById["error"], TData, TQueryData, TQueryKey>>;
    client?: GetServerById["client"]["parameters"];
} = {}): UseQueryResult<TData, GetServerById["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getServerByIdQueryKey(id);
    const query = useQuery({
        ...getServerByIdQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetServerById["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getServerByIdInfiniteQueryKey = (id: GetServerByIdPathParams["id"]) => [{ url: "/api/Servers/:id", params: { id: id } }] as const;
export type GetServerByIdInfiniteQueryKey = ReturnType<typeof getServerByIdInfiniteQueryKey>;
export function getServerByIdInfiniteQueryOptions(id: GetServerByIdPathParams["id"], options: GetServerById["client"]["parameters"] = {}) {
    const queryKey = getServerByIdInfiniteQueryKey(id);
    return infiniteQueryOptions({
        queryKey,
        queryFn: async ({ pageParam }) => {
            const res = await client<GetServerById["data"], GetServerById["error"]>({
                method: "get",
                url: `/api/Servers/${id}`,
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
 * @link /api/Servers/:id
 */
export function useGetServerByIdHookInfinite<TData = InfiniteData<GetServerById["response"]>, TQueryData = GetServerById["response"], TQueryKey extends QueryKey = GetServerByIdInfiniteQueryKey>(id: GetServerByIdPathParams["id"], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetServerById["response"], GetServerById["error"], TData, TQueryData, TQueryKey>>;
    client?: GetServerById["client"]["parameters"];
} = {}): UseInfiniteQueryResult<TData, GetServerById["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getServerByIdInfiniteQueryKey(id);
    const query = useInfiniteQuery({
        ...getServerByIdInfiniteQueryOptions(id, clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, GetServerById["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getServerByIdSuspenseQueryKey = (id: GetServerByIdPathParams["id"]) => [{ url: "/api/Servers/:id", params: { id: id } }] as const;
export type GetServerByIdSuspenseQueryKey = ReturnType<typeof getServerByIdSuspenseQueryKey>;
export function getServerByIdSuspenseQueryOptions(id: GetServerByIdPathParams["id"], options: GetServerById["client"]["parameters"] = {}) {
    const queryKey = getServerByIdSuspenseQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetServerById["data"], GetServerById["error"]>({
                method: "get",
                url: `/api/Servers/${id}`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Servers/:id
 */
export function useGetServerByIdHookSuspense<TData = GetServerById["response"], TQueryKey extends QueryKey = GetServerByIdSuspenseQueryKey>(id: GetServerByIdPathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetServerById["response"], GetServerById["error"], TData, TQueryKey>>;
    client?: GetServerById["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, GetServerById["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getServerByIdSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...getServerByIdSuspenseQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetServerById["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}