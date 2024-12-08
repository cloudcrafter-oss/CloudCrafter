// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetProvidersQueryResponse, GetProvidersQueryParams } from "../types/GetProviders";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getProvidersSuspenseQueryKey = (params?: GetProvidersQueryParams) => [{ url: "/api/Providers" }, ...(params ? [params] : [])] as const;

 export type GetProvidersSuspenseQueryKey = ReturnType<typeof getProvidersSuspenseQueryKey>;

 /**
 * {@link /api/Providers}
 */
async function getProvidersHook(params?: GetProvidersQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetProvidersQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers`, params, ...config });
    return res.data;
}

 export function getProvidersSuspenseQueryOptionsHook(params?: GetProvidersQueryParams, config: Partial<RequestConfig> = {}) {
    const queryKey = getProvidersSuspenseQueryKey(params);
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
export function useGetProvidersSuspenseHook<TData = GetProvidersQueryResponse, TQueryData = GetProvidersQueryResponse, TQueryKey extends QueryKey = GetProvidersSuspenseQueryKey>(params?: GetProvidersQueryParams, options: {
    query?: Partial<UseSuspenseQueryOptions<GetProvidersQueryResponse, Error, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProvidersSuspenseQueryKey(params);
    const query = useSuspenseQuery({
        ...getProvidersSuspenseQueryOptionsHook(params, config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}