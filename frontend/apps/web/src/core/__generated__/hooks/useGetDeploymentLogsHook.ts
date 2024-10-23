import client from "../../frontend/client.ts";
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { GetDeploymentLogsQueryResponse, GetDeploymentLogsPathParams } from "../types/GetDeploymentLogs";
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type GetDeploymentLogsClient = typeof client<GetDeploymentLogsQueryResponse, Error, never>;
type GetDeploymentLogs = {
    data: GetDeploymentLogsQueryResponse;
    error: Error;
    request: never;
    pathParams: GetDeploymentLogsPathParams;
    queryParams: never;
    headerParams: never;
    response: GetDeploymentLogsQueryResponse;
    client: {
        parameters: Partial<Parameters<GetDeploymentLogsClient>[0]>;
        return: Awaited<ReturnType<GetDeploymentLogsClient>>;
    };
};
export const getDeploymentLogsQueryKey = (deploymentId: GetDeploymentLogsPathParams["deploymentId"]) => [{ url: "/api/Stacks/deployments/:deploymentId/logs", params: { deploymentId: deploymentId } }] as const;
export type GetDeploymentLogsQueryKey = ReturnType<typeof getDeploymentLogsQueryKey>;
export function getDeploymentLogsQueryOptions(deploymentId: GetDeploymentLogsPathParams["deploymentId"], options: GetDeploymentLogs["client"]["parameters"] = {}) {
    const queryKey = getDeploymentLogsQueryKey(deploymentId);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetDeploymentLogs["data"], GetDeploymentLogs["error"]>({
                method: "get",
                url: `/api/Stacks/deployments/${deploymentId}/logs`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Stacks/deployments/:deploymentId/logs
 */
export function useGetDeploymentLogsHook<TData = GetDeploymentLogs["response"], TQueryData = GetDeploymentLogs["response"], TQueryKey extends QueryKey = GetDeploymentLogsQueryKey>(deploymentId: GetDeploymentLogsPathParams["deploymentId"], options: {
    query?: Partial<QueryObserverOptions<GetDeploymentLogs["response"], GetDeploymentLogs["error"], TData, TQueryData, TQueryKey>>;
    client?: GetDeploymentLogs["client"]["parameters"];
} = {}): UseQueryResult<TData, GetDeploymentLogs["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getDeploymentLogsQueryKey(deploymentId);
    const query = useQuery({
        ...getDeploymentLogsQueryOptions(deploymentId, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetDeploymentLogs["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getDeploymentLogsInfiniteQueryKey = (deploymentId: GetDeploymentLogsPathParams["deploymentId"]) => [{ url: "/api/Stacks/deployments/:deploymentId/logs", params: { deploymentId: deploymentId } }] as const;
export type GetDeploymentLogsInfiniteQueryKey = ReturnType<typeof getDeploymentLogsInfiniteQueryKey>;
export function getDeploymentLogsInfiniteQueryOptions(deploymentId: GetDeploymentLogsPathParams["deploymentId"], options: GetDeploymentLogs["client"]["parameters"] = {}) {
    const queryKey = getDeploymentLogsInfiniteQueryKey(deploymentId);
    return infiniteQueryOptions({
        queryKey,
// @ts-ignore pageParam is declared but its value is possibly never read
        queryFn: async ({ pageParam }) => {
            const res = await client<GetDeploymentLogs["data"], GetDeploymentLogs["error"]>({
                method: "get",
                url: `/api/Stacks/deployments/${deploymentId}/logs`,
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
 * @link /api/Stacks/deployments/:deploymentId/logs
 */
export function useGetDeploymentLogsHookInfinite<TData = GetDeploymentLogs["response"], TQueryData = GetDeploymentLogs["response"], TQueryKey extends QueryKey = GetDeploymentLogsInfiniteQueryKey>(deploymentId: GetDeploymentLogsPathParams["deploymentId"], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetDeploymentLogs["response"], GetDeploymentLogs["error"], TData, TQueryData, TQueryKey>>;
    client?: GetDeploymentLogs["client"]["parameters"];
} = {}): UseInfiniteQueryResult<TData, GetDeploymentLogs["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getDeploymentLogsInfiniteQueryKey(deploymentId);
    const query = useInfiniteQuery({
        ...getDeploymentLogsInfiniteQueryOptions(deploymentId, clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, GetDeploymentLogs["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getDeploymentLogsSuspenseQueryKey = (deploymentId: GetDeploymentLogsPathParams["deploymentId"]) => [{ url: "/api/Stacks/deployments/:deploymentId/logs", params: { deploymentId: deploymentId } }] as const;
export type GetDeploymentLogsSuspenseQueryKey = ReturnType<typeof getDeploymentLogsSuspenseQueryKey>;
export function getDeploymentLogsSuspenseQueryOptions(deploymentId: GetDeploymentLogsPathParams["deploymentId"], options: GetDeploymentLogs["client"]["parameters"] = {}) {
    const queryKey = getDeploymentLogsSuspenseQueryKey(deploymentId);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetDeploymentLogs["data"], GetDeploymentLogs["error"]>({
                method: "get",
                url: `/api/Stacks/deployments/${deploymentId}/logs`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Stacks/deployments/:deploymentId/logs
 */
export function useGetDeploymentLogsHookSuspense<TData = GetDeploymentLogs["response"], TQueryKey extends QueryKey = GetDeploymentLogsSuspenseQueryKey>(deploymentId: GetDeploymentLogsPathParams["deploymentId"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetDeploymentLogs["response"], GetDeploymentLogs["error"], TData, TQueryKey>>;
    client?: GetDeploymentLogs["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, GetDeploymentLogs["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getDeploymentLogsSuspenseQueryKey(deploymentId);
    const query = useSuspenseQuery({
        ...getDeploymentLogsSuspenseQueryOptions(deploymentId, clientOptions) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetDeploymentLogs["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}