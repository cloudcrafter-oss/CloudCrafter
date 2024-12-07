// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetDeploymentLogsQueryResponse, GetDeploymentLogsPathParams } from "../types/GetDeploymentLogs";
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from "@tanstack/react-query";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

 export const getDeploymentLogsInfiniteQueryKey = (deploymentId: GetDeploymentLogsPathParams["deploymentId"]) => [{ url: "/api/Stacks/deployments/:deploymentId/logs", params: { deploymentId: deploymentId } }] as const;

 export type GetDeploymentLogsInfiniteQueryKey = ReturnType<typeof getDeploymentLogsInfiniteQueryKey>;

 /**
 * {@link /api/Stacks/deployments/:deploymentId/logs}
 */
async function getDeploymentLogsHook(deploymentId: GetDeploymentLogsPathParams["deploymentId"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetDeploymentLogsQueryResponse, Error, unknown>({ method: "GET", url: `/api/Stacks/deployments/${deploymentId}/logs`, ...config });
    return res.data;
}

 export function getDeploymentLogsInfiniteQueryOptionsHook(deploymentId: GetDeploymentLogsPathParams["deploymentId"], config: Partial<RequestConfig> = {}) {
    const queryKey = getDeploymentLogsInfiniteQueryKey(deploymentId);
    return infiniteQueryOptions({
        enabled: !!(deploymentId),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getDeploymentLogsHook(deploymentId, config);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}

 /**
 * {@link /api/Stacks/deployments/:deploymentId/logs}
 */
export function useGetDeploymentLogsInfiniteHook<TData = InfiniteData<GetDeploymentLogsQueryResponse>, TQueryData = GetDeploymentLogsQueryResponse, TQueryKey extends QueryKey = GetDeploymentLogsInfiniteQueryKey>(deploymentId: GetDeploymentLogsPathParams["deploymentId"], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetDeploymentLogsQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getDeploymentLogsInfiniteQueryKey(deploymentId);
    const query = useInfiniteQuery({
        ...getDeploymentLogsInfiniteQueryOptionsHook(deploymentId, config) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}