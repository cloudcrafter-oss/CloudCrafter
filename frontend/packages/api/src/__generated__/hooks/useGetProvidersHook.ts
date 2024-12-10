// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetProvidersQueryResponse, GetProvidersQueryParams } from "../types/GetProviders";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getProvidersQueryKey = (params?: GetProvidersQueryParams) => [{ url: "/api/Providers" }, ...(params ? [params] : [])] as const;

 export type GetProvidersQueryKey = ReturnType<typeof getProvidersQueryKey>;

 /**
 * {@link /api/Providers}
 */
async function getProvidersHook(params?: GetProvidersQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetProvidersQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers`, params, ...config });
    return res.data;
}

 export function getProvidersQueryOptionsHook(params?: GetProvidersQueryParams, config: Partial<RequestConfig> = {}) {
    const queryKey = getProvidersQueryKey(params);
    return queryOptions({
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getProvidersHook(params, config);
        },
    });
}

 /**
 * {@link /api/Providers}
 */
export function useGetProvidersHook<TData = GetProvidersQueryResponse, TQueryData = GetProvidersQueryResponse, TQueryKey extends QueryKey = GetProvidersQueryKey>(params?: GetProvidersQueryParams, options: {
    query?: Partial<QueryObserverOptions<GetProvidersQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProvidersQueryKey(params);
    const query = useQuery({
        ...getProvidersQueryOptionsHook(params, config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}