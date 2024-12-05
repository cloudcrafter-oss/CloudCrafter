// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetServerByIdQueryResponse, GetServerByIdPathParams } from "../types/GetServerById";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getServerByIdQueryKey = (id: GetServerByIdPathParams["id"]) => [{ url: "/api/Servers/:id", params: { id: id } }] as const;

 export type GetServerByIdQueryKey = ReturnType<typeof getServerByIdQueryKey>;

 /**
 * @link /api/Servers/:id
 */
async function getServerByIdHook(id: GetServerByIdPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetServerByIdQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers/${id}`, ...config });
    return res.data;
}

 export function getServerByIdQueryOptionsHook(id: GetServerByIdPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getServerByIdQueryKey(id);
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
 * @link /api/Servers/:id
 */
export function useGetServerByIdHook<TData = GetServerByIdQueryResponse, TQueryData = GetServerByIdQueryResponse, TQueryKey extends QueryKey = GetServerByIdQueryKey>(id: GetServerByIdPathParams["id"], options: {
    query?: Partial<QueryObserverOptions<GetServerByIdQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getServerByIdQueryKey(id);
    const query = useQuery({
        ...getServerByIdQueryOptionsHook(id, config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}