// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetProjectQueryResponse, GetProjectPathParams, GetProject404 } from "../types/GetProject";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getProjectSuspenseQueryKey = (id: GetProjectPathParams["id"]) => [{ url: "/api/Projects/:id", params: { id: id } }] as const;

 export type GetProjectSuspenseQueryKey = ReturnType<typeof getProjectSuspenseQueryKey>;

 /**
 * @link /api/Projects/:id
 */
async function getProjectHook(id: GetProjectPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetProjectQueryResponse, GetProject404, unknown>({ method: "GET", url: `/api/Projects/${id}`, ...config });
    return res.data;
}

 export function getProjectSuspenseQueryOptionsHook(id: GetProjectPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getProjectSuspenseQueryKey(id);
    return queryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getProjectHook(id, config);
        },
    });
}

 /**
 * @link /api/Projects/:id
 */
export function useGetProjectSuspenseHook<TData = GetProjectQueryResponse, TQueryData = GetProjectQueryResponse, TQueryKey extends QueryKey = GetProjectSuspenseQueryKey>(id: GetProjectPathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetProjectQueryResponse, GetProject404, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProjectSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...getProjectSuspenseQueryOptionsHook(id, config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetProject404> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}