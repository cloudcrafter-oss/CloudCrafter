import client from "../../frontend/client.ts";
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { GetFilterableFieldsQueryResponse } from "../types/GetFilterableFields";
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, InfiniteData, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type GetFilterableFieldsClient = typeof client<GetFilterableFieldsQueryResponse, never, never>;
type GetFilterableFields = {
    data: GetFilterableFieldsQueryResponse;
    error: never;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: GetFilterableFieldsQueryResponse;
    client: {
        parameters: Partial<Parameters<GetFilterableFieldsClient>[0]>;
        return: Awaited<ReturnType<GetFilterableFieldsClient>>;
    };
};
export const getFilterableFieldsQueryKey = () => [{ url: "/api/System/get-fields" }] as const;
export type GetFilterableFieldsQueryKey = ReturnType<typeof getFilterableFieldsQueryKey>;
export function getFilterableFieldsQueryOptions(options: GetFilterableFields["client"]["parameters"] = {}) {
    const queryKey = getFilterableFieldsQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetFilterableFields["data"], GetFilterableFields["error"]>({
                method: "get",
                url: `/api/System/get-fields`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/System/get-fields
 */
export function useGetFilterableFieldsHook<TData = GetFilterableFields["response"], TQueryData = GetFilterableFields["response"], TQueryKey extends QueryKey = GetFilterableFieldsQueryKey>(options: {
    query?: Partial<QueryObserverOptions<GetFilterableFields["response"], GetFilterableFields["error"], TData, TQueryData, TQueryKey>>;
    client?: GetFilterableFields["client"]["parameters"];
} = {}): UseQueryResult<TData, GetFilterableFields["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getFilterableFieldsQueryKey();
    const query = useQuery({
        ...getFilterableFieldsQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetFilterableFields["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getFilterableFieldsInfiniteQueryKey = () => [{ url: "/api/System/get-fields" }] as const;
export type GetFilterableFieldsInfiniteQueryKey = ReturnType<typeof getFilterableFieldsInfiniteQueryKey>;
export function getFilterableFieldsInfiniteQueryOptions(options: GetFilterableFields["client"]["parameters"] = {}) {
    const queryKey = getFilterableFieldsInfiniteQueryKey();
    return infiniteQueryOptions({
        queryKey,
// @ts-ignore pageParam is declared but its value is possibly never read
        queryFn: async ({ pageParam }) => {
            const res = await client<GetFilterableFields["data"], GetFilterableFields["error"]>({
                method: "get",
                url: `/api/System/get-fields`,
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
 * @link /api/System/get-fields
 */
export function useGetFilterableFieldsHookInfinite<TData = InfiniteData<GetFilterableFields["response"]>, TQueryData = GetFilterableFields["response"], TQueryKey extends QueryKey = GetFilterableFieldsInfiniteQueryKey>(options: {
    query?: Partial<InfiniteQueryObserverOptions<GetFilterableFields["response"], GetFilterableFields["error"], TData, TQueryData, TQueryKey>>;
    client?: GetFilterableFields["client"]["parameters"];
} = {}): UseInfiniteQueryResult<TData, GetFilterableFields["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getFilterableFieldsInfiniteQueryKey();
    const query = useInfiniteQuery({
        ...getFilterableFieldsInfiniteQueryOptions(clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, GetFilterableFields["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getFilterableFieldsSuspenseQueryKey = () => [{ url: "/api/System/get-fields" }] as const;
export type GetFilterableFieldsSuspenseQueryKey = ReturnType<typeof getFilterableFieldsSuspenseQueryKey>;
export function getFilterableFieldsSuspenseQueryOptions(options: GetFilterableFields["client"]["parameters"] = {}) {
    const queryKey = getFilterableFieldsSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetFilterableFields["data"], GetFilterableFields["error"]>({
                method: "get",
                url: `/api/System/get-fields`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/System/get-fields
 */
export function useGetFilterableFieldsHookSuspense<TData = GetFilterableFields["response"], TQueryKey extends QueryKey = GetFilterableFieldsSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<GetFilterableFields["response"], GetFilterableFields["error"], TData, TQueryKey>>;
    client?: GetFilterableFields["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, GetFilterableFields["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getFilterableFieldsSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...getFilterableFieldsSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetFilterableFields["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}