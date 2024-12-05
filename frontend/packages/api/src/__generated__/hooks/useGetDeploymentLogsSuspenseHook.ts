// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetDeploymentLogsQueryResponse, GetDeploymentLogsPathParams } from "../types/GetDeploymentLogs";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getDeploymentLogsSuspenseQueryKey = (deploymentId: GetDeploymentLogsPathParams["deploymentId"]) => [{ url: "/api/Stacks/deployments/:deploymentId/logs", params: { deploymentId: deploymentId } }] as const;

 export type GetDeploymentLogsSuspenseQueryKey = ReturnType<typeof getDeploymentLogsSuspenseQueryKey>;

 /**
 * @link /api/Stacks/deployments/:deploymentId/logs
 */
async function getDeploymentLogsHook(deploymentId: GetDeploymentLogsPathParams["deploymentId"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetDeploymentLogsQueryResponse, Error, unknown>({ method: "GET", url: `/api/Stacks/deployments/${deploymentId}/logs`, ...config });
    return res.data;
}

 export function getDeploymentLogsSuspenseQueryOptionsHook(deploymentId: GetDeploymentLogsPathParams["deploymentId"], config: Partial<RequestConfig> = {}) {
    const queryKey = getDeploymentLogsSuspenseQueryKey(deploymentId);
    return queryOptions({
        enabled: !!(deploymentId),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getDeploymentLogsHook(deploymentId, config);
        },
    });
}

 /**
 * @link /api/Stacks/deployments/:deploymentId/logs
 */
export function useGetDeploymentLogsSuspenseHook<TData = GetDeploymentLogsQueryResponse, TQueryData = GetDeploymentLogsQueryResponse, TQueryKey extends QueryKey = GetDeploymentLogsSuspenseQueryKey>(deploymentId: GetDeploymentLogsPathParams["deploymentId"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetDeploymentLogsQueryResponse, Error, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getDeploymentLogsSuspenseQueryKey(deploymentId);
    const query = useSuspenseQuery({
        ...getDeploymentLogsSuspenseQueryOptionsHook(deploymentId, config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}