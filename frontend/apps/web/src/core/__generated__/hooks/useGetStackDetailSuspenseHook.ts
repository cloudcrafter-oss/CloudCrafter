// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetStackDetailQueryResponse, GetStackDetailPathParams, GetStackDetail404 } from "../types/GetStackDetail.ts";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getStackDetailSuspenseQueryKey = (id: GetStackDetailPathParams["id"]) => [{ url: "/api/Stacks/:id", params: { id: id } }] as const;

 export type GetStackDetailSuspenseQueryKey = ReturnType<typeof getStackDetailSuspenseQueryKey>;

 /**
 * @link /api/Stacks/:id
 */
async function getStackDetailHook(id: GetStackDetailPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetStackDetailQueryResponse, GetStackDetail404, unknown>({ method: "GET", url: `/api/Stacks/${id}`, ...config });
    return res.data;
}

 export function getStackDetailSuspenseQueryOptionsHook(id: GetStackDetailPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getStackDetailSuspenseQueryKey(id);
    return queryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getStackDetailHook(id, config);
        },
    });
}

 /**
 * @link /api/Stacks/:id
 */
export function useGetStackDetailSuspenseHook<TData = GetStackDetailQueryResponse, TQueryData = GetStackDetailQueryResponse, TQueryKey extends QueryKey = GetStackDetailSuspenseQueryKey>(id: GetStackDetailPathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetStackDetailQueryResponse, GetStackDetail404, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getStackDetailSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...getStackDetailSuspenseQueryOptionsHook(id, config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetStackDetail404> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}