import client from "../../frontend/client.ts";
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { GetSendExampleMessageToAgentQueryResponse, GetSendExampleMessageToAgentQueryParams } from "../types/GetSendExampleMessageToAgent";
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type GetSendExampleMessageToAgentClient = typeof client<GetSendExampleMessageToAgentQueryResponse, Error, never>;
type GetSendExampleMessageToAgent = {
    data: GetSendExampleMessageToAgentQueryResponse;
    error: Error;
    request: never;
    pathParams: never;
    queryParams: GetSendExampleMessageToAgentQueryParams;
    headerParams: never;
    response: GetSendExampleMessageToAgentQueryResponse;
    client: {
        parameters: Partial<Parameters<GetSendExampleMessageToAgentClient>[0]>;
        return: Awaited<ReturnType<GetSendExampleMessageToAgentClient>>;
    };
};
export const getSendExampleMessageToAgentQueryKey = (params: GetSendExampleMessageToAgent["queryParams"]) => [{ url: "/api/Test/agent" }, ...(params ? [params] : [])] as const;
export type GetSendExampleMessageToAgentQueryKey = ReturnType<typeof getSendExampleMessageToAgentQueryKey>;
export function getSendExampleMessageToAgentQueryOptions(params: GetSendExampleMessageToAgent["queryParams"], options: GetSendExampleMessageToAgent["client"]["parameters"] = {}) {
    const queryKey = getSendExampleMessageToAgentQueryKey(params);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetSendExampleMessageToAgent["data"], GetSendExampleMessageToAgent["error"]>({
                method: "get",
                url: `/api/Test/agent`,
                params,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Test/agent
 */
export function useGetSendExampleMessageToAgentHook<TData = GetSendExampleMessageToAgent["response"], TQueryData = GetSendExampleMessageToAgent["response"], TQueryKey extends QueryKey = GetSendExampleMessageToAgentQueryKey>(params: GetSendExampleMessageToAgent["queryParams"], options: {
    query?: Partial<QueryObserverOptions<GetSendExampleMessageToAgent["response"], GetSendExampleMessageToAgent["error"], TData, TQueryData, TQueryKey>>;
    client?: GetSendExampleMessageToAgent["client"]["parameters"];
} = {}): UseQueryResult<TData, GetSendExampleMessageToAgent["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getSendExampleMessageToAgentQueryKey(params);
    const query = useQuery({
        ...getSendExampleMessageToAgentQueryOptions(params, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetSendExampleMessageToAgent["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getSendExampleMessageToAgentInfiniteQueryKey = (params: GetSendExampleMessageToAgent["queryParams"]) => [{ url: "/api/Test/agent" }, ...(params ? [params] : [])] as const;
export type GetSendExampleMessageToAgentInfiniteQueryKey = ReturnType<typeof getSendExampleMessageToAgentInfiniteQueryKey>;
export function getSendExampleMessageToAgentInfiniteQueryOptions(params: GetSendExampleMessageToAgent["queryParams"], options: GetSendExampleMessageToAgent["client"]["parameters"] = {}) {
    const queryKey = getSendExampleMessageToAgentInfiniteQueryKey(params);
    return infiniteQueryOptions({
        queryKey,
// @ts-ignore pageParam is declared but its value is possibly never read
        queryFn: async ({ pageParam }) => {
            const res = await client<GetSendExampleMessageToAgent["data"], GetSendExampleMessageToAgent["error"]>({
                method: "get",
                url: `/api/Test/agent`,
                ...options,
                params: {
                    ...params,
                    ["id"]: pageParam,
                    ...(options.params || {}),
                }
            });
            return res.data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}
/**
 * @link /api/Test/agent
 */
export function useGetSendExampleMessageToAgentHookInfinite<TData = GetSendExampleMessageToAgent["response"], TQueryData = GetSendExampleMessageToAgent["response"], TQueryKey extends QueryKey = GetSendExampleMessageToAgentInfiniteQueryKey>(params: GetSendExampleMessageToAgent["queryParams"], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetSendExampleMessageToAgent["response"], GetSendExampleMessageToAgent["error"], TData, TQueryData, TQueryKey>>;
    client?: GetSendExampleMessageToAgent["client"]["parameters"];
} = {}): UseInfiniteQueryResult<TData, GetSendExampleMessageToAgent["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getSendExampleMessageToAgentInfiniteQueryKey(params);
    const query = useInfiniteQuery({
        ...getSendExampleMessageToAgentInfiniteQueryOptions(params, clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, GetSendExampleMessageToAgent["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getSendExampleMessageToAgentSuspenseQueryKey = (params: GetSendExampleMessageToAgent["queryParams"]) => [{ url: "/api/Test/agent" }, ...(params ? [params] : [])] as const;
export type GetSendExampleMessageToAgentSuspenseQueryKey = ReturnType<typeof getSendExampleMessageToAgentSuspenseQueryKey>;
export function getSendExampleMessageToAgentSuspenseQueryOptions(params: GetSendExampleMessageToAgent["queryParams"], options: GetSendExampleMessageToAgent["client"]["parameters"] = {}) {
    const queryKey = getSendExampleMessageToAgentSuspenseQueryKey(params);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetSendExampleMessageToAgent["data"], GetSendExampleMessageToAgent["error"]>({
                method: "get",
                url: `/api/Test/agent`,
                params,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Test/agent
 */
export function useGetSendExampleMessageToAgentHookSuspense<TData = GetSendExampleMessageToAgent["response"], TQueryKey extends QueryKey = GetSendExampleMessageToAgentSuspenseQueryKey>(params: GetSendExampleMessageToAgent["queryParams"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetSendExampleMessageToAgent["response"], GetSendExampleMessageToAgent["error"], TData, TQueryKey>>;
    client?: GetSendExampleMessageToAgent["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, GetSendExampleMessageToAgent["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getSendExampleMessageToAgentSuspenseQueryKey(params);
    const query = useSuspenseQuery({
        ...getSendExampleMessageToAgentSuspenseQueryOptions(params, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetSendExampleMessageToAgent["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}