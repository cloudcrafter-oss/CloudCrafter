import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetProvidersQueryResponse } from "../types/GetProviders.ts";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getProvidersSuspenseQueryKey = () => [{ url: "/api/Providers" }] as const;

 export type GetProvidersSuspenseQueryKey = ReturnType<typeof getProvidersSuspenseQueryKey>;

 /**
 * @link /api/Providers
 */
async function getProvidersHook(config: Partial<RequestConfig> = {}) {
    const res = await client<GetProvidersQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers`, ...config });
    return res.data;
}

 export function getProvidersSuspenseQueryOptionsHook(config: Partial<RequestConfig> = {}) {
    const queryKey = getProvidersSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getProvidersHook(config);
        },
    });
}

 /**
 * @link /api/Providers
 */
export function useGetProvidersSuspenseHook<TData = GetProvidersQueryResponse, TQueryData = GetProvidersQueryResponse, TQueryKey extends QueryKey = GetProvidersSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<GetProvidersQueryResponse, Error, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProvidersSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...getProvidersSuspenseQueryOptionsHook(config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}