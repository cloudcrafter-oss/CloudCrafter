// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetDeploymentsForStackQueryResponse, GetDeploymentsForStackPathParams } from "../types/GetDeploymentsForStack.ts";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getDeploymentsForStackQueryKey = (id: GetDeploymentsForStackPathParams["id"]) => [{ url: "/api/Stacks/:id/deployments", params: { id: id } }] as const;

 export type GetDeploymentsForStackQueryKey = ReturnType<typeof getDeploymentsForStackQueryKey>;

 /**
 * @link /api/Stacks/:id/deployments
 */
async function getDeploymentsForStackHook(id: GetDeploymentsForStackPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetDeploymentsForStackQueryResponse, Error, unknown>({ method: "GET", url: `/api/Stacks/${id}/deployments`, ...config });
    return res.data;
}

 export function getDeploymentsForStackQueryOptionsHook(id: GetDeploymentsForStackPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getDeploymentsForStackQueryKey(id);
    return queryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getDeploymentsForStackHook(id, config);
        },
    });
}

 /**
 * @link /api/Stacks/:id/deployments
 */
export function useGetDeploymentsForStackHook<TData = GetDeploymentsForStackQueryResponse, TQueryData = GetDeploymentsForStackQueryResponse, TQueryKey extends QueryKey = GetDeploymentsForStackQueryKey>(id: GetDeploymentsForStackPathParams["id"], options: {
    query?: Partial<QueryObserverOptions<GetDeploymentsForStackQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getDeploymentsForStackQueryKey(id);
    const query = useQuery({
        ...getDeploymentsForStackQueryOptionsHook(id, config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}