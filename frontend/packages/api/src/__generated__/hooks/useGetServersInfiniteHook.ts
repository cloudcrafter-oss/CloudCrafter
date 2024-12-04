// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetServersQueryResponse } from "../types/GetServers.ts";
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from "@tanstack/react-query";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

 export const getServersInfiniteQueryKey = () => [{ url: "/api/Servers" }] as const;

 export type GetServersInfiniteQueryKey = ReturnType<typeof getServersInfiniteQueryKey>;

 /**
 * @link /api/Servers
 */
async function getServersHook(config: Partial<RequestConfig> = {}) {
    const res = await client<GetServersQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers`, ...config });
    return res.data;
}

 export function getServersInfiniteQueryOptionsHook(config: Partial<RequestConfig> = {}) {
    const queryKey = getServersInfiniteQueryKey();
    return infiniteQueryOptions({
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getServersHook(config);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}

 /**
 * @link /api/Servers
 */
export function useGetServersInfiniteHook<TData = InfiniteData<GetServersQueryResponse>, TQueryData = GetServersQueryResponse, TQueryKey extends QueryKey = GetServersInfiniteQueryKey>(options: {
    query?: Partial<InfiniteQueryObserverOptions<GetServersQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getServersInfiniteQueryKey();
    const query = useInfiniteQuery({
        ...getServersInfiniteQueryOptionsHook(config) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}