// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetServerByIdQueryResponse, GetServerByIdPathParams } from "../types/GetServerById";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getServerByIdSuspenseQueryKey = (id: GetServerByIdPathParams["id"]) => [{ url: "/api/Servers/:id", params: { id: id } }] as const;

 export type GetServerByIdSuspenseQueryKey = ReturnType<typeof getServerByIdSuspenseQueryKey>;

 /**
 * {@link /api/Servers/:id}
 */
async function getServerByIdHook(id: GetServerByIdPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetServerByIdQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers/${id}`, ...config });
    return res.data;
}

 export function getServerByIdSuspenseQueryOptionsHook(id: GetServerByIdPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getServerByIdSuspenseQueryKey(id);
    return queryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getServerByIdHook(id, config);
        },
    });
}

 /**
 * {@link /api/Servers/:id}
 */
export function useGetServerByIdSuspenseHook<TData = GetServerByIdQueryResponse, TQueryData = GetServerByIdQueryResponse, TQueryKey extends QueryKey = GetServerByIdSuspenseQueryKey>(id: GetServerByIdPathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetServerByIdQueryResponse, Error, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getServerByIdSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...getServerByIdSuspenseQueryOptionsHook(id, config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}