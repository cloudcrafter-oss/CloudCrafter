// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetFilterableFieldsQueryResponse } from "../types/GetFilterableFields";
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from "@tanstack/react-query";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

 export const getFilterableFieldsInfiniteQueryKey = () => [{ url: "/api/System/get-fields" }] as const;

 export type GetFilterableFieldsInfiniteQueryKey = ReturnType<typeof getFilterableFieldsInfiniteQueryKey>;

 /**
 * {@link /api/System/get-fields}
 */
async function getFilterableFieldsHook(config: Partial<RequestConfig> = {}) {
    const res = await client<GetFilterableFieldsQueryResponse, Error, unknown>({ method: "GET", url: `/api/System/get-fields`, ...config });
    return res.data;
}

 export function getFilterableFieldsInfiniteQueryOptionsHook(config: Partial<RequestConfig> = {}) {
    const queryKey = getFilterableFieldsInfiniteQueryKey();
    return infiniteQueryOptions({
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getFilterableFieldsHook(config);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}

 /**
 * {@link /api/System/get-fields}
 */
export function useGetFilterableFieldsInfiniteHook<TData = InfiniteData<GetFilterableFieldsQueryResponse>, TQueryData = GetFilterableFieldsQueryResponse, TQueryKey extends QueryKey = GetFilterableFieldsInfiniteQueryKey>(options: {
    query?: Partial<InfiniteQueryObserverOptions<GetFilterableFieldsQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getFilterableFieldsInfiniteQueryKey();
    const query = useInfiniteQuery({
        ...getFilterableFieldsInfiniteQueryOptionsHook(config) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}