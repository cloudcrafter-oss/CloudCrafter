// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetProjectEnvironmentEnhancedQueryResponse, GetProjectEnvironmentEnhancedPathParams, GetProjectEnvironmentEnhanced404 } from "../types/GetProjectEnvironmentEnhanced.ts";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getProjectEnvironmentEnhancedSuspenseQueryKey = (id: GetProjectEnvironmentEnhancedPathParams["id"], environmentId: GetProjectEnvironmentEnhancedPathParams["environmentId"]) => [{ url: "/api/Projects/:id/:environmentId", params: { id: id, environmentId: environmentId } }] as const;

 export type GetProjectEnvironmentEnhancedSuspenseQueryKey = ReturnType<typeof getProjectEnvironmentEnhancedSuspenseQueryKey>;

 /**
 * @link /api/Projects/:id/:environmentId
 */
async function getProjectEnvironmentEnhancedHook(id: GetProjectEnvironmentEnhancedPathParams["id"], environmentId: GetProjectEnvironmentEnhancedPathParams["environmentId"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetProjectEnvironmentEnhancedQueryResponse, GetProjectEnvironmentEnhanced404, unknown>({ method: "GET", url: `/api/Projects/${id}/${environmentId}`, ...config });
    return res.data;
}

 export function getProjectEnvironmentEnhancedSuspenseQueryOptionsHook(id: GetProjectEnvironmentEnhancedPathParams["id"], environmentId: GetProjectEnvironmentEnhancedPathParams["environmentId"], config: Partial<RequestConfig> = {}) {
    const queryKey = getProjectEnvironmentEnhancedSuspenseQueryKey(id, environmentId);
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
export function useGetProjectEnvironmentEnhancedSuspenseHook<TData = GetProjectEnvironmentEnhancedQueryResponse, TQueryData = GetProjectEnvironmentEnhancedQueryResponse, TQueryKey extends QueryKey = GetProjectEnvironmentEnhancedSuspenseQueryKey>(id: GetProjectEnvironmentEnhancedPathParams["id"], environmentId: GetProjectEnvironmentEnhancedPathParams["environmentId"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetProjectEnvironmentEnhancedQueryResponse, GetProjectEnvironmentEnhanced404, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProjectEnvironmentEnhancedSuspenseQueryKey(id, environmentId);
    const query = useSuspenseQuery({
        ...getProjectEnvironmentEnhancedSuspenseQueryOptionsHook(id, environmentId, config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetProjectEnvironmentEnhanced404> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}