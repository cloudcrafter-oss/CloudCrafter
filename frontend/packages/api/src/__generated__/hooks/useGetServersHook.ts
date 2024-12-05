// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetServersQueryResponse } from "../types/GetServers";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getServersQueryKey = () => [{ url: "/api/Servers" }] as const;

 export type GetServersQueryKey = ReturnType<typeof getServersQueryKey>;

 /**
 * @link /api/Servers
 */
async function getServersHook(config: Partial<RequestConfig> = {}) {
    const res = await client<GetServersQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers`, ...config });
    return res.data;
}

 export function getServersQueryOptionsHook(config: Partial<RequestConfig> = {}) {
    const queryKey = getServersQueryKey();
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
export function useGetServersHook<TData = GetServersQueryResponse, TQueryData = GetServersQueryResponse, TQueryKey extends QueryKey = GetServersQueryKey>(options: {
    query?: Partial<QueryObserverOptions<GetServersQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getServersQueryKey();
    const query = useQuery({
        ...getServersQueryOptionsHook(config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}