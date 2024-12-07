// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetProvidersQueryResponse } from "../types/GetProviders";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getProvidersQueryKey = () => [{ url: "/api/Providers" }] as const;

 export type GetProvidersQueryKey = ReturnType<typeof getProvidersQueryKey>;

 /**
 * {@link /api/Providers}
 */
async function getProvidersHook(config: Partial<RequestConfig> = {}) {
    const res = await client<GetProvidersQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers`, ...config });
    return res.data;
}

 export function getProvidersQueryOptionsHook(config: Partial<RequestConfig> = {}) {
    const queryKey = getProvidersQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getProvidersHook(config);
        },
    });
}

 /**
 * {@link /api/Providers}
 */
export function useGetProvidersHook<TData = GetProvidersQueryResponse, TQueryData = GetProvidersQueryResponse, TQueryKey extends QueryKey = GetProvidersQueryKey>(options: {
    query?: Partial<QueryObserverOptions<GetProvidersQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProvidersQueryKey();
    const query = useQuery({
        ...getProvidersQueryOptionsHook(config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}