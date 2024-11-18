// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetDeploymentsForServerQueryResponse, GetDeploymentsForServerPathParams } from "../types/GetDeploymentsForServer.ts";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getDeploymentsForServerQueryKey = (id: GetDeploymentsForServerPathParams["id"]) => [{ url: "/api/Servers/:id/deployments", params: { id: id } }] as const;

 export type GetDeploymentsForServerQueryKey = ReturnType<typeof getDeploymentsForServerQueryKey>;

 /**
 * @link /api/Servers/:id/deployments
 */
async function getDeploymentsForServerHook(id: GetDeploymentsForServerPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetDeploymentsForServerQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers/${id}/deployments`, ...config });
    return res.data;
}

 export function getDeploymentsForServerQueryOptionsHook(id: GetDeploymentsForServerPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getDeploymentsForServerQueryKey(id);
    return queryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getDeploymentsForServerHook(id, config);
        },
    });
}

 /**
 * @link /api/Servers/:id/deployments
 */
export function useGetDeploymentsForServerHook<TData = GetDeploymentsForServerQueryResponse, TQueryData = GetDeploymentsForServerQueryResponse, TQueryKey extends QueryKey = GetDeploymentsForServerQueryKey>(id: GetDeploymentsForServerPathParams["id"], options: {
    query?: Partial<QueryObserverOptions<GetDeploymentsForServerQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getDeploymentsForServerQueryKey(id);
    const query = useQuery({
        ...getDeploymentsForServerQueryOptionsHook(id, config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}