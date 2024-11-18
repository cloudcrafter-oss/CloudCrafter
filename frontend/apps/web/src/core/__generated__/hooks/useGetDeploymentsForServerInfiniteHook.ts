// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetDeploymentsForServerQueryResponse, GetDeploymentsForServerPathParams } from "../types/GetDeploymentsForServer.ts";
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from "@tanstack/react-query";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

 export const getDeploymentsForServerInfiniteQueryKey = (id: GetDeploymentsForServerPathParams["id"]) => [{ url: "/api/Servers/:id/deployments", params: { id: id } }] as const;

 export type GetDeploymentsForServerInfiniteQueryKey = ReturnType<typeof getDeploymentsForServerInfiniteQueryKey>;

 /**
 * @link /api/Servers/:id/deployments
 */
async function getDeploymentsForServerHook(id: GetDeploymentsForServerPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetDeploymentsForServerQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers/${id}/deployments`, ...config });
    return res.data;
}

 export function getDeploymentsForServerInfiniteQueryOptionsHook(id: GetDeploymentsForServerPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getDeploymentsForServerInfiniteQueryKey(id);
    return infiniteQueryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getDeploymentsForServerHook(id, config);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}

 /**
 * @link /api/Servers/:id/deployments
 */
export function useGetDeploymentsForServerInfiniteHook<TData = InfiniteData<GetDeploymentsForServerQueryResponse>, TQueryData = GetDeploymentsForServerQueryResponse, TQueryKey extends QueryKey = GetDeploymentsForServerInfiniteQueryKey>(id: GetDeploymentsForServerPathParams["id"], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetDeploymentsForServerQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getDeploymentsForServerInfiniteQueryKey(id);
    const query = useInfiniteQuery({
        ...getDeploymentsForServerInfiniteQueryOptionsHook(id, config) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}