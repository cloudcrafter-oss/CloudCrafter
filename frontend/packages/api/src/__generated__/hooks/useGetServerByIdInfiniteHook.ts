// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetServerByIdQueryResponse, GetServerByIdPathParams } from "../types/GetServerById";
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from "@tanstack/react-query";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

 export const getServerByIdInfiniteQueryKey = (id: GetServerByIdPathParams["id"]) => [{ url: "/api/Servers/:id", params: { id: id } }] as const;

 export type GetServerByIdInfiniteQueryKey = ReturnType<typeof getServerByIdInfiniteQueryKey>;

 /**
 * @link /api/Servers/:id
 */
async function getServerByIdHook(id: GetServerByIdPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetServerByIdQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers/${id}`, ...config });
    return res.data;
}

 export function getServerByIdInfiniteQueryOptionsHook(id: GetServerByIdPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getServerByIdInfiniteQueryKey(id);
    return infiniteQueryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getServerByIdHook(id, config);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}

 /**
 * @link /api/Servers/:id
 */
export function useGetServerByIdInfiniteHook<TData = InfiniteData<GetServerByIdQueryResponse>, TQueryData = GetServerByIdQueryResponse, TQueryKey extends QueryKey = GetServerByIdInfiniteQueryKey>(id: GetServerByIdPathParams["id"], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetServerByIdQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getServerByIdInfiniteQueryKey(id);
    const query = useInfiniteQuery({
        ...getServerByIdInfiniteQueryOptionsHook(id, config) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}