// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetProjectEnvironmentEnhancedQueryResponse, GetProjectEnvironmentEnhancedPathParams, GetProjectEnvironmentEnhanced404 } from "../types/GetProjectEnvironmentEnhanced";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getProjectEnvironmentEnhancedQueryKey = (id: GetProjectEnvironmentEnhancedPathParams["id"], environmentId: GetProjectEnvironmentEnhancedPathParams["environmentId"]) => [{ url: "/api/Projects/:id/:environmentId", params: { id: id, environmentId: environmentId } }] as const;

 export type GetProjectEnvironmentEnhancedQueryKey = ReturnType<typeof getProjectEnvironmentEnhancedQueryKey>;

 /**
 * @link /api/Projects/:id/:environmentId
 */
async function getProjectEnvironmentEnhancedHook(id: GetProjectEnvironmentEnhancedPathParams["id"], environmentId: GetProjectEnvironmentEnhancedPathParams["environmentId"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetProjectEnvironmentEnhancedQueryResponse, GetProjectEnvironmentEnhanced404, unknown>({ method: "GET", url: `/api/Projects/${id}/${environmentId}`, ...config });
    return res.data;
}

 export function getProjectEnvironmentEnhancedQueryOptionsHook(id: GetProjectEnvironmentEnhancedPathParams["id"], environmentId: GetProjectEnvironmentEnhancedPathParams["environmentId"], config: Partial<RequestConfig> = {}) {
    const queryKey = getProjectEnvironmentEnhancedQueryKey(id, environmentId);
    return queryOptions({
        enabled: !!(id && environmentId),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getProjectEnvironmentEnhancedHook(id, environmentId, config);
        },
    });
}

 /**
 * @link /api/Projects/:id/:environmentId
 */
export function useGetProjectEnvironmentEnhancedHook<TData = GetProjectEnvironmentEnhancedQueryResponse, TQueryData = GetProjectEnvironmentEnhancedQueryResponse, TQueryKey extends QueryKey = GetProjectEnvironmentEnhancedQueryKey>(id: GetProjectEnvironmentEnhancedPathParams["id"], environmentId: GetProjectEnvironmentEnhancedPathParams["environmentId"], options: {
    query?: Partial<QueryObserverOptions<GetProjectEnvironmentEnhancedQueryResponse, GetProjectEnvironmentEnhanced404, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProjectEnvironmentEnhancedQueryKey(id, environmentId);
    const query = useQuery({
        ...getProjectEnvironmentEnhancedQueryOptionsHook(id, environmentId, config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetProjectEnvironmentEnhanced404> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}