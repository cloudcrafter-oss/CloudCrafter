// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetDeploymentLogsQueryResponse, GetDeploymentLogsPathParams } from "../types/GetDeploymentLogs";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getDeploymentLogsQueryKey = (deploymentId: GetDeploymentLogsPathParams["deploymentId"]) => [{ url: "/api/Stacks/deployments/:deploymentId/logs", params: { deploymentId: deploymentId } }] as const;

 export type GetDeploymentLogsQueryKey = ReturnType<typeof getDeploymentLogsQueryKey>;

 /**
 * @link /api/Stacks/deployments/:deploymentId/logs
 */
async function getDeploymentLogsHook(deploymentId: GetDeploymentLogsPathParams["deploymentId"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetDeploymentLogsQueryResponse, Error, unknown>({ method: "GET", url: `/api/Stacks/deployments/${deploymentId}/logs`, ...config });
    return res.data;
}

 export function getDeploymentLogsQueryOptionsHook(deploymentId: GetDeploymentLogsPathParams["deploymentId"], config: Partial<RequestConfig> = {}) {
    const queryKey = getDeploymentLogsQueryKey(deploymentId);
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
export function useGetDeploymentLogsHook<TData = GetDeploymentLogsQueryResponse, TQueryData = GetDeploymentLogsQueryResponse, TQueryKey extends QueryKey = GetDeploymentLogsQueryKey>(deploymentId: GetDeploymentLogsPathParams["deploymentId"], options: {
    query?: Partial<QueryObserverOptions<GetDeploymentLogsQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getDeploymentLogsQueryKey(deploymentId);
    const query = useQuery({
        ...getDeploymentLogsQueryOptionsHook(deploymentId, config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}