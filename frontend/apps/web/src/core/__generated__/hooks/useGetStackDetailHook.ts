import client from "../../frontend/client.ts";
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { GetStackDetailQueryResponse, GetStackDetailPathParams, GetStackDetail404 } from "../types/GetStackDetail";
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type GetStackDetailClient = typeof client<GetStackDetailQueryResponse, GetStackDetail404, never>;
type GetStackDetail = {
    data: GetStackDetailQueryResponse;
    error: GetStackDetail404;
    request: never;
    pathParams: GetStackDetailPathParams;
    queryParams: never;
    headerParams: never;
    response: GetStackDetailQueryResponse;
    client: {
        parameters: Partial<Parameters<GetStackDetailClient>[0]>;
        return: Awaited<ReturnType<GetStackDetailClient>>;
    };
};
export const getStackDetailQueryKey = (id: GetStackDetailPathParams["id"]) => [{ url: "/api/Stacks/:id", params: { id: id } }] as const;
export type GetStackDetailQueryKey = ReturnType<typeof getStackDetailQueryKey>;
export function getStackDetailQueryOptions(id: GetStackDetailPathParams["id"], options: GetStackDetail["client"]["parameters"] = {}) {
    const queryKey = getStackDetailQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetStackDetail["data"], GetStackDetail["error"]>({
                method: "get",
                url: `/api/Stacks/${id}`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Stacks/:id
 */
export function useGetStackDetailHook<TData = GetStackDetail["response"], TQueryData = GetStackDetail["response"], TQueryKey extends QueryKey = GetStackDetailQueryKey>(id: GetStackDetailPathParams["id"], options: {
    query?: Partial<QueryObserverOptions<GetStackDetail["response"], GetStackDetail["error"], TData, TQueryData, TQueryKey>>;
    client?: GetStackDetail["client"]["parameters"];
} = {}): UseQueryResult<TData, GetStackDetail["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getStackDetailQueryKey(id);
    const query = useQuery({
        ...getStackDetailQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetStackDetail["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getStackDetailInfiniteQueryKey = (id: GetStackDetailPathParams["id"]) => [{ url: "/api/Stacks/:id", params: { id: id } }] as const;
export type GetStackDetailInfiniteQueryKey = ReturnType<typeof getStackDetailInfiniteQueryKey>;
export function getStackDetailInfiniteQueryOptions(id: GetStackDetailPathParams["id"], options: GetStackDetail["client"]["parameters"] = {}) {
    const queryKey = getStackDetailInfiniteQueryKey(id);
    return infiniteQueryOptions({
        queryKey,
// @ts-ignore pageParam is declared but its value is possibly never read
        queryFn: async ({ pageParam }) => {
            const res = await client<GetStackDetail["data"], GetStackDetail["error"]>({
                method: "get",
                url: `/api/Stacks/${id}`,
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
 * @link /api/Stacks/:id
 */
export function useGetStackDetailHookInfinite<TData = GetStackDetail["response"], TQueryData = GetStackDetail["response"], TQueryKey extends QueryKey = GetStackDetailInfiniteQueryKey>(id: GetStackDetailPathParams["id"], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetStackDetail["response"], GetStackDetail["error"], TData, TQueryData, TQueryKey>>;
    client?: GetStackDetail["client"]["parameters"];
} = {}): UseInfiniteQueryResult<TData, GetStackDetail["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getStackDetailInfiniteQueryKey(id);
    const query = useInfiniteQuery({
        ...getStackDetailInfiniteQueryOptions(id, clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, GetStackDetail["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getStackDetailSuspenseQueryKey = (id: GetStackDetailPathParams["id"]) => [{ url: "/api/Stacks/:id", params: { id: id } }] as const;
export type GetStackDetailSuspenseQueryKey = ReturnType<typeof getStackDetailSuspenseQueryKey>;
export function getStackDetailSuspenseQueryOptions(id: GetStackDetailPathParams["id"], options: GetStackDetail["client"]["parameters"] = {}) {
    const queryKey = getStackDetailSuspenseQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetStackDetail["data"], GetStackDetail["error"]>({
                method: "get",
                url: `/api/Stacks/${id}`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Stacks/:id
 */
export function useGetStackDetailHookSuspense<TData = GetStackDetail["response"], TQueryKey extends QueryKey = GetStackDetailSuspenseQueryKey>(id: GetStackDetailPathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetStackDetail["response"], GetStackDetail["error"], TData, TQueryKey>>;
    client?: GetStackDetail["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, GetStackDetail["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getStackDetailSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...getStackDetailSuspenseQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetStackDetail["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}