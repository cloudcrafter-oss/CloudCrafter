// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetServersQueryResponse } from "../types/GetServers.ts";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getServersSuspenseQueryKey = () => [{ url: "/api/Servers" }] as const;

 export type GetServersSuspenseQueryKey = ReturnType<typeof getServersSuspenseQueryKey>;

 /**
 * @link /api/Servers
 */
async function getServersHook(config: Partial<RequestConfig> = {}) {
    const res = await client<GetServersQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers`, ...config });
    return res.data;
}

 export function getServersSuspenseQueryOptionsHook(config: Partial<RequestConfig> = {}) {
    const queryKey = getServersSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getServersHook(config);
        },
    });
}

 /**
 * @link /api/Servers
 */
export function useGetServersSuspenseHook<TData = GetServersQueryResponse, TQueryData = GetServersQueryResponse, TQueryKey extends QueryKey = GetServersSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<GetServersQueryResponse, Error, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getServersSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...getServersSuspenseQueryOptionsHook(config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}