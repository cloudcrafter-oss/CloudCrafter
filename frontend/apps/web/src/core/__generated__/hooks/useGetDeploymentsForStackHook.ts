import client from "../../frontend/client.ts";
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { GetDeploymentsForStackQueryResponse, GetDeploymentsForStackPathParams } from "../types/GetDeploymentsForStack";
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type GetDeploymentsForStackClient = typeof client<GetDeploymentsForStackQueryResponse, Error, never>;
type GetDeploymentsForStack = {
    data: GetDeploymentsForStackQueryResponse;
    error: Error;
    request: never;
    pathParams: GetDeploymentsForStackPathParams;
    queryParams: never;
    headerParams: never;
    response: GetDeploymentsForStackQueryResponse;
    client: {
        parameters: Partial<Parameters<GetDeploymentsForStackClient>[0]>;
        return: Awaited<ReturnType<GetDeploymentsForStackClient>>;
    };
};
export const getDeploymentsForStackQueryKey = (id: GetDeploymentsForStackPathParams["id"]) => [{ url: "/api/Stacks/:id/deployments", params: { id: id } }] as const;
export type GetDeploymentsForStackQueryKey = ReturnType<typeof getDeploymentsForStackQueryKey>;
export function getDeploymentsForStackQueryOptions(id: GetDeploymentsForStackPathParams["id"], options: GetDeploymentsForStack["client"]["parameters"] = {}) {
    const queryKey = getDeploymentsForStackQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetDeploymentsForStack["data"], GetDeploymentsForStack["error"]>({
                method: "get",
                url: `/api/Stacks/${id}/deployments`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Stacks/:id/deployments
 */
export function useGetDeploymentsForStackHook<TData = GetDeploymentsForStack["response"], TQueryData = GetDeploymentsForStack["response"], TQueryKey extends QueryKey = GetDeploymentsForStackQueryKey>(id: GetDeploymentsForStackPathParams["id"], options: {
    query?: Partial<QueryObserverOptions<GetDeploymentsForStack["response"], GetDeploymentsForStack["error"], TData, TQueryData, TQueryKey>>;
    client?: GetDeploymentsForStack["client"]["parameters"];
} = {}): UseQueryResult<TData, GetDeploymentsForStack["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getDeploymentsForStackQueryKey(id);
    const query = useQuery({
        ...getDeploymentsForStackQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetDeploymentsForStack["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getDeploymentsForStackInfiniteQueryKey = (id: GetDeploymentsForStackPathParams["id"]) => [{ url: "/api/Stacks/:id/deployments", params: { id: id } }] as const;
export type GetDeploymentsForStackInfiniteQueryKey = ReturnType<typeof getDeploymentsForStackInfiniteQueryKey>;
export function getDeploymentsForStackInfiniteQueryOptions(id: GetDeploymentsForStackPathParams["id"], options: GetDeploymentsForStack["client"]["parameters"] = {}) {
    const queryKey = getDeploymentsForStackInfiniteQueryKey(id);
    return infiniteQueryOptions({
        queryKey,
// @ts-ignore pageParam is declared but its value is possibly never read
        queryFn: async ({ pageParam }) => {
            const res = await client<GetDeploymentsForStack["data"], GetDeploymentsForStack["error"]>({
                method: "get",
                url: `/api/Stacks/${id}/deployments`,
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
 * @link /api/Stacks/:id/deployments
 */
export function useGetDeploymentsForStackHookInfinite<TData = GetDeploymentsForStack["response"], TQueryData = GetDeploymentsForStack["response"], TQueryKey extends QueryKey = GetDeploymentsForStackInfiniteQueryKey>(id: GetDeploymentsForStackPathParams["id"], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetDeploymentsForStack["response"], GetDeploymentsForStack["error"], TData, TQueryData, TQueryKey>>;
    client?: GetDeploymentsForStack["client"]["parameters"];
} = {}): UseInfiniteQueryResult<TData, GetDeploymentsForStack["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getDeploymentsForStackInfiniteQueryKey(id);
    const query = useInfiniteQuery({
        ...getDeploymentsForStackInfiniteQueryOptions(id, clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, GetDeploymentsForStack["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getDeploymentsForStackSuspenseQueryKey = (id: GetDeploymentsForStackPathParams["id"]) => [{ url: "/api/Stacks/:id/deployments", params: { id: id } }] as const;
export type GetDeploymentsForStackSuspenseQueryKey = ReturnType<typeof getDeploymentsForStackSuspenseQueryKey>;
export function getDeploymentsForStackSuspenseQueryOptions(id: GetDeploymentsForStackPathParams["id"], options: GetDeploymentsForStack["client"]["parameters"] = {}) {
    const queryKey = getDeploymentsForStackSuspenseQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetDeploymentsForStack["data"], GetDeploymentsForStack["error"]>({
                method: "get",
                url: `/api/Stacks/${id}/deployments`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Stacks/:id/deployments
 */
export function useGetDeploymentsForStackHookSuspense<TData = GetDeploymentsForStack["response"], TQueryKey extends QueryKey = GetDeploymentsForStackSuspenseQueryKey>(id: GetDeploymentsForStackPathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetDeploymentsForStack["response"], GetDeploymentsForStack["error"], TData, TQueryKey>>;
    client?: GetDeploymentsForStack["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, GetDeploymentsForStack["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getDeploymentsForStackSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...getDeploymentsForStackSuspenseQueryOptions(id, clientOptions) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetDeploymentsForStack["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}