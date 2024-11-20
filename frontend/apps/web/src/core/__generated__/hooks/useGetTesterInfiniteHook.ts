// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetTesterQueryResponse, GetTesterQueryParams } from "../types/GetTester.ts";
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from "@tanstack/react-query";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

 export const getTesterInfiniteQueryKey = (params?: GetTesterQueryParams) => [{ url: "/api/Test" }, ...(params ? [params] : [])] as const;

 export type GetTesterInfiniteQueryKey = ReturnType<typeof getTesterInfiniteQueryKey>;

 /**
 * @link /api/Test
 */
async function getTesterHook(params?: GetTesterQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetTesterQueryResponse, Error, unknown>({ method: "GET", url: `/api/Test`, params, ...config });
    return res.data;
}

 export function getTesterInfiniteQueryOptionsHook(params?: GetTesterQueryParams, config: Partial<RequestConfig> = {}) {
    const queryKey = getTesterInfiniteQueryKey(params);
    return infiniteQueryOptions({
        queryKey,
        queryFn: async ({ signal, pageParam }) => {
            config.signal = signal;
            if (params) {
                params["id"] = pageParam as unknown as GetTesterQueryParams["id"];
            }
            return getTesterHook(params, config);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}

 /**
 * @link /api/Test
 */
export function useGetTesterInfiniteHook<TData = InfiniteData<GetTesterQueryResponse>, TQueryData = GetTesterQueryResponse, TQueryKey extends QueryKey = GetTesterInfiniteQueryKey>(params?: GetTesterQueryParams, options: {
    query?: Partial<InfiniteQueryObserverOptions<GetTesterQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getTesterInfiniteQueryKey(params);
    const query = useInfiniteQuery({
        ...getTesterInfiniteQueryOptionsHook(params, config) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}