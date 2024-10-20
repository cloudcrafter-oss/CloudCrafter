import client from "../../frontend/client.ts";
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { SendExampleDeploymentQueryResponse } from "../types/SendExampleDeployment";
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type SendExampleDeploymentClient = typeof client<SendExampleDeploymentQueryResponse, Error, never>;
type SendExampleDeployment = {
    data: SendExampleDeploymentQueryResponse;
    error: Error;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: SendExampleDeploymentQueryResponse;
    client: {
        parameters: Partial<Parameters<SendExampleDeploymentClient>[0]>;
        return: Awaited<ReturnType<SendExampleDeploymentClient>>;
    };
};
export const sendExampleDeploymentQueryKey = () => [{ url: "/api/Test" }] as const;
export type SendExampleDeploymentQueryKey = ReturnType<typeof sendExampleDeploymentQueryKey>;
export function sendExampleDeploymentQueryOptions(options: SendExampleDeployment["client"]["parameters"] = {}) {
    const queryKey = sendExampleDeploymentQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<SendExampleDeployment["data"], SendExampleDeployment["error"]>({
                method: "get",
                url: `/api/Test`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Test
 */
export function useSendExampleDeploymentHook<TData = SendExampleDeployment["response"], TQueryData = SendExampleDeployment["response"], TQueryKey extends QueryKey = SendExampleDeploymentQueryKey>(options: {
    query?: Partial<QueryObserverOptions<SendExampleDeployment["response"], SendExampleDeployment["error"], TData, TQueryData, TQueryKey>>;
    client?: SendExampleDeployment["client"]["parameters"];
} = {}): UseQueryResult<TData, SendExampleDeployment["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? sendExampleDeploymentQueryKey();
    const query = useQuery({
        ...sendExampleDeploymentQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, SendExampleDeployment["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const sendExampleDeploymentInfiniteQueryKey = () => [{ url: "/api/Test" }] as const;
export type SendExampleDeploymentInfiniteQueryKey = ReturnType<typeof sendExampleDeploymentInfiniteQueryKey>;
export function sendExampleDeploymentInfiniteQueryOptions(options: SendExampleDeployment["client"]["parameters"] = {}) {
    const queryKey = sendExampleDeploymentInfiniteQueryKey();
    return infiniteQueryOptions({
        queryKey,
// @ts-ignore pageParam is declared but its value is possibly never read
        queryFn: async ({ pageParam }) => {
            const res = await client<SendExampleDeployment["data"], SendExampleDeployment["error"]>({
                method: "get",
                url: `/api/Test`,
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
 * @link /api/Test
 */
export function useSendExampleDeploymentHookInfinite<TData = SendExampleDeployment["response"], TQueryData = SendExampleDeployment["response"], TQueryKey extends QueryKey = SendExampleDeploymentInfiniteQueryKey>(options: {
    query?: Partial<InfiniteQueryObserverOptions<SendExampleDeployment["response"], SendExampleDeployment["error"], TData, TQueryData, TQueryKey>>;
    client?: SendExampleDeployment["client"]["parameters"];
} = {}): UseInfiniteQueryResult<TData, SendExampleDeployment["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? sendExampleDeploymentInfiniteQueryKey();
    const query = useInfiniteQuery({
        ...sendExampleDeploymentInfiniteQueryOptions(clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, SendExampleDeployment["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const sendExampleDeploymentSuspenseQueryKey = () => [{ url: "/api/Test" }] as const;
export type SendExampleDeploymentSuspenseQueryKey = ReturnType<typeof sendExampleDeploymentSuspenseQueryKey>;
export function sendExampleDeploymentSuspenseQueryOptions(options: SendExampleDeployment["client"]["parameters"] = {}) {
    const queryKey = sendExampleDeploymentSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<SendExampleDeployment["data"], SendExampleDeployment["error"]>({
                method: "get",
                url: `/api/Test`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Test
 */
export function useSendExampleDeploymentHookSuspense<TData = SendExampleDeployment["response"], TQueryKey extends QueryKey = SendExampleDeploymentSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<SendExampleDeployment["response"], SendExampleDeployment["error"], TData, TQueryKey>>;
    client?: SendExampleDeployment["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, SendExampleDeployment["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? sendExampleDeploymentSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...sendExampleDeploymentSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, SendExampleDeployment["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}