// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetProvidersQueryResponse } from "../types/GetProviders.ts";
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from "@tanstack/react-query";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

 export const getProvidersInfiniteQueryKey = () => [{ url: "/api/Providers" }] as const;

 export type GetProvidersInfiniteQueryKey = ReturnType<typeof getProvidersInfiniteQueryKey>;

 /**
 * @link /api/Providers
 */
async function getProvidersHook(config: Partial<RequestConfig> = {}) {
    const res = await client<GetProvidersQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers`, ...config });
    return res.data;
}

 export function getProvidersInfiniteQueryOptionsHook(config: Partial<RequestConfig> = {}) {
    const queryKey = getProvidersInfiniteQueryKey();
    return infiniteQueryOptions({
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getProvidersHook(config);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}

 /**
 * @link /api/Providers
 */
export function useGetProvidersInfiniteHook<TData = InfiniteData<GetProvidersQueryResponse>, TQueryData = GetProvidersQueryResponse, TQueryKey extends QueryKey = GetProvidersInfiniteQueryKey>(options: {
    query?: Partial<InfiniteQueryObserverOptions<GetProvidersQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProvidersInfiniteQueryKey();
    const query = useInfiniteQuery({
        ...getProvidersInfiniteQueryOptionsHook(config) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}